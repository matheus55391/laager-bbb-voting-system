/**
 * Aggregate Service - Microserviço de agregação e contabilização de votos
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
        queue: 'aggregate_queue',
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();
  Logger.log('� Aggregate Service is listening for messages...');
}

bootstrap();
