import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { VotesRepository } from './database/votes.repository';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AGGREGATE_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'aggregate_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, VotesRepository],
})
export class AppModule {}
