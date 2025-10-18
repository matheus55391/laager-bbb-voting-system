import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Vote } from '@prisma/votes-client';

export interface CreateVoteInput {
    participantId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    fingerprint?: string;
}

@Injectable()
export class VotesRepository {
    private readonly logger = new Logger(VotesRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    async createVote(input: CreateVoteInput): Promise<Vote> {
        const now = new Date();
        const votedHour = new Date(now);
        votedHour.setMinutes(0, 0, 0);

        const vote = await this.prisma.vote.create({
            data: {
                participantId: input.participantId,
                userId: input.userId,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
                fingerprint: input.fingerprint,
                votedHour,
            },
        });

        return vote;
    }

    async getTotalVotes(): Promise<number> {
        return this.prisma.vote.count();
    }

    async getVotesByParticipant(participantId: string): Promise<number> {
        return this.prisma.vote.count({
            where: { participantId },
        });
    }

    async getVotesByHour(startDate: Date, endDate: Date) {
        const votes = await this.prisma.vote.groupBy({
            by: ['votedHour'],
            _count: { id: true },
            where: {
                votedHour: { gte: startDate, lte: endDate },
            },
            orderBy: { votedHour: 'asc' },
        });

        return votes.reduce((acc, vote) => {
            acc[vote.votedHour.toISOString()] = vote._count.id;
            return acc;
        }, {} as Record<string, number>);
    }

    async getStats() {
        const total = await this.getTotalVotes();
        const byParticipant = await this.prisma.vote.groupBy({
            by: ['participantId'],
            _count: { id: true },
        });

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const byHour = await this.getVotesByHour(last24h, new Date());

        return {
            totalVotes: total,
            votesByParticipant: byParticipant.reduce((acc, item) => {
                acc[item.participantId] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            votesByHour: byHour,
        };
    }
}
