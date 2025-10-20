import {
    Injectable,
    NestMiddleware,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RateLimitMiddleware.name);
    private redisClient: Redis;
    private readonly MAX_VOTES_PER_MINUTE = 10;
    private readonly WINDOW_SIZE_SECONDS = 60;

    constructor() {
        this.redisClient = new Redis({
            host: process.env['REDIS_HOST'] || 'localhost',
            port: parseInt(process.env['REDIS_PORT'] || '6379'),
        });

        this.redisClient.on('error', (err: Error) => {
            this.logger.error('Redis Client Error', err);
        });

        this.redisClient.on('connect', () => {
            this.logger.log('Connected to Redis for rate limiting');
        });
    }

    async use(req: Request, res: Response, next: NextFunction) {
        if (req.method !== 'POST' || !req.path.includes('/votes')) {
            return next();
        }

        const ip =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            req.ip ||
            'unknown';

        try {
            await this.checkRateLimit(ip);
            next();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.warn(
                `Rate limit check failed for IP ${ip}, allowing request: ${
                    (error as Error).message
                }`
            );
            next();
        }
    }

    private async checkRateLimit(ip: string): Promise<void> {
        const key = `rate_limit:vote:${ip}`;

        try {
            const count = await this.redisClient.incr(key);

            if (count === 1) {
                await this.redisClient.expire(key, this.WINDOW_SIZE_SECONDS);
            }

            if (count > this.MAX_VOTES_PER_MINUTE) {
                const ttl = await this.redisClient.ttl(key);
                this.logger.warn(
                    `Rate limit exceeded for IP ${ip}: ${count} votes in window (max ${this.MAX_VOTES_PER_MINUTE})`
                );

                throw new HttpException(
                    {
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message: `Você excedeu o limite de votos. Aguarde ${ttl} segundos antes de votar novamente.`,
                        error: 'Too Many Requests',
                        retryAfter: ttl,
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }

            this.logger.debug(
                `Rate limit check passed for IP ${ip}: ${count}/${this.MAX_VOTES_PER_MINUTE}`
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new Error(
                `Redis operation failed: ${(error as Error).message}`
            );
        }
    }
}
