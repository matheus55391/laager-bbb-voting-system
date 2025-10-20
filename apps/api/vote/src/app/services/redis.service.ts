import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;

    constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.client = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });
    }

    async onModuleInit() {
        this.client.on('connect', () => {
            this.logger.log('✅ Connected to Redis');
        });

        this.client.on('error', (error) => {
            this.logger.error('❌ Redis connection error:', error);
        });

        this.client.on('ready', () => {
            this.logger.log('🚀 Redis client is ready');
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
        this.logger.log('👋 Disconnected from Redis');
    }

    getClient(): Redis {
        return this.client;
    }

    async getVoteCount(participantId: string): Promise<number> {
        const count = await this.client.get(`votes:${participantId}`);
        return count ? parseInt(count, 10) : 0;
    }

    async incrementVoteCount(participantId: string): Promise<number> {
        return await this.client.incr(`votes:${participantId}`);
    }

    async getTotalVotes(): Promise<number> {
        const total = await this.client.get('votes:total');
        return total ? parseInt(total, 10) : 0;
    }

    async incrementTotalVotes(): Promise<number> {
        return await this.client.incr('votes:total');
    }

    async getAllVoteCounts(): Promise<Record<string, number>> {
        const keys = await this.client.keys('votes:*');
        const voteCounts: Record<string, number> = {};

        for (const key of keys) {
            if (key === 'votes:total') continue;
            const participantId = key.replace('votes:', '');
            const count = await this.client.get(key);
            voteCounts[participantId] = count ? parseInt(count, 10) : 0;
        }

        return voteCounts;
    }

    async setVoteCount(participantId: string, count: number): Promise<void> {
        await this.client.set(`votes:${participantId}`, count);
    }

    async setTotalVotes(total: number): Promise<void> {
        await this.client.set('votes:total', total);
    }

    async clearAllVotes(): Promise<void> {
        const keys = await this.client.keys('votes:*');
        if (keys.length > 0) {
            await this.client.del(...keys);
        }
    }
}
