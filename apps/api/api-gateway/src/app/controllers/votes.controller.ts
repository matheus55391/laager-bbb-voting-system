import {
    ResultsResponseDto,
    VoteDto,
    VoteResponseDto,
    HourlyStatsResponseDto,
} from '@laager-bbb-voting-system/common';
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    HttpException,
    HttpStatus,
    Logger,
    Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import { Request } from 'express';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
    private readonly logger = new Logger(VotesController.name);

    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy
    ) {}

    /**
     * POST /votes - Registrar um novo voto
     *
     * Fluxo:
     * 1. Recebe voto do frontend
     * 2. Publica mensagem na fila 'votes_queue' do RabbitMQ
     * 3. Vote Service processa de forma assíncrona
     * 4. Retorna confirmação de recebimento imediata
     */
    @Post()
    @ApiOperation({ summary: 'Registrar um novo voto' })
    @ApiResponse({
        status: 201,
        description: 'Voto registrado com sucesso',
        type: VoteResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos',
    })
    @ApiResponse({
        status: 429,
        description: 'Muitos votos da mesma origem - possível bot detectado',
    })
    async vote(
        @Body() voteDto: VoteDto,
        @Req() req: Request
    ): Promise<VoteResponseDto> {
        this.logger.log(
            `Received vote request for participant: ${voteDto.participantId}`
        );

        try {
            // Extrair IP e User-Agent da requisição
            const ipAddress =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                req.ip ||
                'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';

            // Adicionar informações ao DTO
            const enrichedVoteDto: VoteDto = {
                ...voteDto,
                ipAddress,
                userAgent,
            };

            this.logger.log(
                `Vote details - IP: ${ipAddress}, User-Agent: ${userAgent}`
            );

            // Publicar mensagem na fila RabbitMQ (fire-and-forget pattern)
            // O Vote Service irá processar de forma assíncrona
            this.rabbitClient.emit('vote.create', enrichedVoteDto);

            // Retornar resposta imediata para o frontend
            // O voto será processado em background pelo Vote Service
            return {
                message: 'Voto recebido e será processado',
                voteId: 'pending', // ID temporário, será gerado pelo Vote Service
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(
                `Error emitting vote: ${(error as Error).message}`,
                (error as Error).stack
            );
            throw new HttpException(
                'Erro ao processar voto. Tente novamente.',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * GET /votes - Obter status completo da votação
     *
     * Fluxo:
     * 1. Frontend solicita status
     * 2. API Gateway faz request/reply ao Vote Service via RabbitMQ
     * 3. Vote Service consulta Redis (ou Postgres se cache miss)
     * 4. Retorna candidatos + totais + percentuais
     */
    @Get()
    @ApiOperation({ summary: 'Obter status completo da votação' })
    @ApiResponse({
        status: 200,
        description: 'Status da votação com candidatos, totais e percentuais',
        type: ResultsResponseDto,
    })
    async getVotingStatus(): Promise<ResultsResponseDto> {
        this.logger.log('Fetching voting status...');

        try {
            // Fazer request/reply ao Vote Service via RabbitMQ
            // Padrão request/reply: envia mensagem e aguarda resposta
            const result$ = this.rabbitClient
                .send<ResultsResponseDto>('vote.getStatus', {})
                .pipe(timeout(5000)); // Timeout de 5 segundos

            const results = await firstValueFrom(result$);

            this.logger.log(
                `Voting status retrieved: ${results.totalVotes} total votes`
            );
            return results;
        } catch (error) {
            this.logger.error(
                `Error fetching voting status: ${error.message}`,
                error.stack
            );

            if (error.name === 'TimeoutError') {
                throw new HttpException(
                    'Tempo limite excedido ao buscar resultados',
                    HttpStatus.GATEWAY_TIMEOUT
                );
            }

            throw new HttpException(
                'Erro ao buscar resultados da votação',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * GET /votes/results - Alias para getVotingStatus (compatibilidade)
     */
    @Get('results')
    @ApiOperation({ summary: 'Obter resultados da votação (alias)' })
    @ApiResponse({
        status: 200,
        description: 'Resultados da votação',
        type: ResultsResponseDto,
    })
    async getResults(): Promise<ResultsResponseDto> {
        return this.getVotingStatus();
    }

    /**
     * GET /votes/stats/hourly - Obter estatísticas de votos por hora
     *
     * Requisito Laager: "A produção do programa gostaria de consultar em uma URL
     * o total geral de votos, o total por participante e o total de votos por hora."
     *
     * Fluxo:
     * 1. Frontend/Produção solicita stats horárias
     * 2. API Gateway faz request/reply ao Vote Service via RabbitMQ
     * 3. Vote Service consulta Postgres com GROUP BY por hora
     * 4. Retorna array com votos agrupados por hora
     */
    @Get('stats/hourly')
    @ApiOperation({
        summary: 'Obter estatísticas de votos agrupadas por hora',
        description:
            'Retorna o total de votos agrupados por hora. Requisito do desafio Laager.',
    })
    @ApiResponse({
        status: 200,
        description: 'Estatísticas horárias da votação',
        type: HourlyStatsResponseDto,
    })
    async getHourlyStats(): Promise<HourlyStatsResponseDto> {
        this.logger.log('Fetching hourly voting statistics...');

        try {
            // Fazer request/reply ao Vote Service via RabbitMQ
            const result$ = this.rabbitClient
                .send<HourlyStatsResponseDto>('vote.getHourlyStats', {})
                .pipe(timeout(5000)); // Timeout de 5 segundos

            const stats = await firstValueFrom(result$);

            this.logger.log(
                `Hourly stats retrieved: ${stats.hourlyStats.length} hours`
            );
            return stats;
        } catch (error) {
            this.logger.error(
                `Error fetching hourly stats: ${error.message}`,
                error.stack
            );

            if (error.name === 'TimeoutError') {
                throw new HttpException(
                    'Tempo limite excedido ao buscar estatísticas',
                    HttpStatus.GATEWAY_TIMEOUT
                );
            }

            throw new HttpException(
                'Erro ao buscar estatísticas horárias',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
