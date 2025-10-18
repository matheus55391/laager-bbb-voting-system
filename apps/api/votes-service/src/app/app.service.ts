import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VotesRepository } from './database/votes.repository';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        @Inject('AGGREGATE_SERVICE')
        private readonly aggregateClient: ClientProxy,
        private readonly votesRepository: VotesRepository
    ) {}

    async processVote(data: {
        voteId: string;
        participantId: string;
        userId?: string;
        ipAddress?: string;
        userAgent?: string;
        fingerprint?: string;
        timestamp: string;
    }): Promise<void> {
        const vote = await this.votesRepository.createVote({
            participantId: data.participantId,
            userId: data.userId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            fingerprint: data.fingerprint,
        });

        this.aggregateClient.emit('vote_processed', {
            ...data,
            voteId: vote.id,
            dbTimestamp: vote.createdAt.toISOString(),
        });

        this.logger.log(`Vote ${vote.id} processed`);
    }

    async healthCheck() {
        try {
            const totalVotes = await this.votesRepository.getTotalVotes();
            return { status: 'healthy', database: 'connected', totalVotes };
        } catch (error) {
            this.logger.error('Health check failed:', error);
            return {
                status: 'unhealthy',
                database: 'disconnected',
                totalVotes: 0,
            };
        }
    }

    async getStats() {
        return this.votesRepository.getStats();
    }
}
