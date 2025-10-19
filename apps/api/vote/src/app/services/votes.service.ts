import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    VoteDto,
    VoteResponseDto,
    ResultsResponseDto,
    ParticipantResult,
    HourlyStatsResponseDto,
    HourlyStatsDto,
} from '@laager-bbb-voting-system/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Injectable()
export class VotesService {
    private readonly logger = new Logger(VotesService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        @Inject('EVENTS_SERVICE') private readonly eventsClient: ClientProxy
    ) {}

    /**
     * Processa um voto recebido da fila RabbitMQ
     * Fluxo:
     * 1. Valida o participante
     * 2. Persiste no Postgres
     * 3. Atualiza contadores no Redis
     * 4. Publica evento vote.processed
     */
    async processVote(voteDto: VoteDto): Promise<VoteResponseDto> {
        this.logger.log(
            `Processing vote for participant: ${voteDto.participantId}`
        );

        try {
            // 1. Validar se o participante existe e está ativo
            const participant = await this.prisma.participant.findUnique({
                where: { id: voteDto.participantId },
            });

            if (!participant) {
                throw new Error(
                    `Participant ${voteDto.participantId} not found`
                );
            }

            if (!participant.isActive) {
                throw new Error(
                    `Participant ${voteDto.participantId} is not active`
                );
            }

            // 2. Persistir voto no Postgres (fonte única de verdade)
            const vote = await this.prisma.vote.create({
                data: {
                    participantId: voteDto.participantId,
                    userId: voteDto.userId,
                    // Capturar IP e User-Agent para análise anti-bot
                    ipAddress: voteDto.ipAddress || null,
                    userAgent: voteDto.userAgent || null,
                },
            });

            this.logger.log(`Vote persisted in database: ${vote.id}`);

            // 3. Atualizar contadores no Redis para consultas rápidas
            await this.redis.incrementVoteCount(voteDto.participantId);
            await this.redis.incrementTotalVotes();

            this.logger.log(
                `Redis counters updated for participant: ${voteDto.participantId}`
            );

            // 4. Publicar evento vote.processed para outros serviços (Stats, Dashboard, etc)
            this.eventsClient.emit('vote.processed', {
                voteId: vote.id,
                participantId: vote.participantId,
                timestamp: vote.createdAt.toISOString(),
            });

            // 5. Retornar resposta
            return {
                message: 'Voto registrado com sucesso',
                voteId: vote.id,
                timestamp: vote.createdAt.toISOString(),
            };
        } catch (error) {
            this.logger.error(
                `Error processing vote: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    /**
     * Obtém o status completo da votação
     * Estratégia:
     * 1. Tenta buscar do Redis (cache rápido)
     * 2. Se cache miss, consulta Postgres
     * 3. Atualiza Redis com os dados do Postgres
     * 4. Calcula percentuais e retorna
     */
    async getVotingStatus(): Promise<ResultsResponseDto> {
        this.logger.log('Fetching voting status...');

        try {
            // 1. Buscar participantes ativos
            const participants = await this.prisma.participant.findMany({
                where: { isActive: true },
                select: { id: true, name: true },
            });

            // 2. Buscar contadores do Redis primeiro
            let totalVotes = await this.redis.getTotalVotes();
            const results: ParticipantResult[] = [];

            // Se não há dados no Redis, buscar do Postgres
            if (totalVotes === 0) {
                this.logger.log('Cache miss - fetching from database...');
                await this.syncRedisFromDatabase();
                totalVotes = await this.redis.getTotalVotes();
            }

            // 3. Montar resultados por participante
            for (const participant of participants) {
                const votes = await this.redis.getVoteCount(participant.id);
                const percentage =
                    totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

                results.push({
                    participantId: participant.id,
                    votes,
                    percentage: parseFloat(percentage.toFixed(2)),
                });
            }

            // 4. Ordenar por número de votos (decrescente)
            results.sort((a, b) => b.votes - a.votes);

            return {
                totalVotes,
                results,
                lastUpdated: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(
                `Error fetching voting status: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    /**
     * Sincroniza contadores do Redis com dados do Postgres
     * Usado quando há cache miss ou para recuperação de falhas
     */
    private async syncRedisFromDatabase(): Promise<void> {
        this.logger.log('Syncing Redis from database...');

        // Contar votos por participante no banco
        const voteCounts = await this.prisma.vote.groupBy({
            by: ['participantId'],
            _count: {
                id: true,
            },
        });

        // Limpar Redis e repovoar com dados corretos
        await this.redis.clearAllVotes();

        let totalVotes = 0;
        for (const voteCount of voteCounts) {
            const count = voteCount._count.id;
            await this.redis.setVoteCount(voteCount.participantId, count);
            totalVotes += count;
        }

        await this.redis.setTotalVotes(totalVotes);
        this.logger.log(`Redis synced: ${totalVotes} total votes`);
    }

    /**
     * Obtém estatísticas de votos agrupadas por hora
     * Requisito do desafio Laager: consultar total de votos por hora
     */
    async getHourlyStats(): Promise<HourlyStatsResponseDto> {
        this.logger.log('Fetching hourly voting statistics...');

        try {
            // Query raw SQL para agrupar votos por hora usando DATE_TRUNC
            const hourlyData = await this.prisma.$queryRaw<
                Array<{ hour: Date; votes: bigint }>
            >`
                SELECT
                    DATE_TRUNC('hour', created_at) as hour,
                    COUNT(*)::bigint as votes
                FROM votes
                GROUP BY DATE_TRUNC('hour', created_at)
                ORDER BY hour DESC
            `;

            // Converter BigInt para número e formatar resposta
            const hourlyStats: HourlyStatsDto[] = hourlyData.map((row) => ({
                hour: row.hour.toISOString(),
                votes: Number(row.votes),
            }));

            // Calcular total geral
            const totalVotes = hourlyStats.reduce(
                (sum, stat) => sum + stat.votes,
                0
            );

            this.logger.log(
                `Hourly stats retrieved: ${hourlyStats.length} hours, ${totalVotes} total votes`
            );

            return {
                hourlyStats,
                totalVotes,
                lastUpdated: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(
                `Error fetching hourly stats: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }
}
