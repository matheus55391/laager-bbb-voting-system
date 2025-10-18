import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import Redis from 'ioredis';

interface VoteData {
    participantId: string;
    votes: number;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CacheService.name);
    private redis: Redis;
    private readonly VOTES_KEY = 'votes';
    private readonly LAST_UPDATED_KEY = 'last_updated';

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        this.redis.on('connect', () => {
            this.logger.log('Connected to Redis');
        });

        this.redis.on('error', (err) => {
            this.logger.error('Redis connection error:', err);
        });
    }

    async onModuleInit() {
        await this.redis.set(this.LAST_UPDATED_KEY, new Date().toISOString());
        this.logger.log('Cache Service initialized with Redis');
    }

    async onModuleDestroy() {
        await this.redis.quit();
        this.logger.log('Disconnected from Redis');
    }

    async incrementVote(participantId: string): Promise<void> {
        await this.redis.hincrby(this.VOTES_KEY, participantId, 1);
        await this.redis.set(this.LAST_UPDATED_KEY, new Date().toISOString());

        const votes = await this.redis.hget(this.VOTES_KEY, participantId);
        this.logger.debug(`Vote incremented for ${participantId}: ${votes}`);
    }

    async getResults(): Promise<{
        totalVotes: number;
        results: Array<{
            participantId: string;
            votes: number;
            percentage: number;
        }>;
        lastUpdated: string;
    }> {
        const votesData = await this.redis.hgetall(this.VOTES_KEY);
        const lastUpdated =
            (await this.redis.get(this.LAST_UPDATED_KEY)) ||
            new Date().toISOString();

        const results: VoteData[] = [];
        let totalVotes = 0;

        for (const [participantId, votesStr] of Object.entries(votesData)) {
            const votes = parseInt(votesStr, 10);
            results.push({ participantId, votes });
            totalVotes += votes;
        }

        const resultsWithPercentage = results.map((result) => ({
            participantId: result.participantId,
            votes: result.votes,
            percentage: totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0,
        }));

        resultsWithPercentage.sort((a, b) => b.votes - a.votes);

        return {
            totalVotes,
            results: resultsWithPercentage,
            lastUpdated,
        };
    }

    async clearCache(): Promise<void> {
        await this.redis.del(this.VOTES_KEY);
        await this.redis.set(this.LAST_UPDATED_KEY, new Date().toISOString());
        this.logger.log('Cache cleared');
    }

    async getVotesByHour(): Promise<Record<string, number>> {
        // Implementação futura para estatísticas por hora
        return {};
    }
}
