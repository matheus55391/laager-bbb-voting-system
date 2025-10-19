import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: ['error', 'warn'],
            errorFormat: 'pretty',
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Connected to Postgres database');
        } catch (error) {
            this.logger.error(
                '❌ Failed to connect to Postgres database',
                error
            );
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('👋 Disconnected from Postgres database');
    }
}
