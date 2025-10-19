import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis.service';
import { VotesService } from './services/votes.service';

@Module({
    imports: [
        // Cliente RabbitMQ para publicar eventos (vote.processed)
        ClientsModule.register([
            {
                name: 'EVENTS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'events_queue',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, RedisService, VotesService],
})
export class AppModule {}
