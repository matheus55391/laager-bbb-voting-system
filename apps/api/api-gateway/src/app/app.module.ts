import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './controllers/health.controller';
import { VotesController } from './controllers/votes.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBITMQ_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'votes_queue',
                    queueOptions: {
                        durable: true, // Sincronizado com Vote Service
                    },
                },
            },
        ]),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [HealthController, VotesController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*')
            .apply(RateLimitMiddleware)
            .forRoutes('votes'); // Aplicar rate limiting apenas em rotas de votação
    }
}
