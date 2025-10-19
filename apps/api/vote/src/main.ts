/**
 * Vote Service - Microserviço de processamento e consulta de votos
 *
 * Responsabilidades:
 * - Processar votos recebidos via RabbitMQ
 * - Validar e persistir votos no Postgres
 * - Atualizar contadores no Redis
 * - Responder a consultas de status da votação
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: 'votes_queue',
                queueOptions: {
                    durable: true, // Garantir persistência das mensagens
                },
                // Prefetch: processar uma mensagem por vez para garantir consistência
                prefetchCount: 1,
            },
        }
    );

    await app.listen();
    Logger.log('🗳️  Vote Service is listening for messages on votes_queue...');
}

bootstrap();
