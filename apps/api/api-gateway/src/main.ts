/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: '*',
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('BBB Voting System API')
        .setDescription(
            'API Gateway for BBB Voting System\n\n' +
                'Architecture:\n' +
                '- POST /api/votes → Send vote to RabbitMQ\n' +
                '- GET /api/votes/results → Get aggregated results from Aggregate Service\n' +
                '- GET /api/stats → Get real-time statistics from Stats Service via HTTP\n' +
                '- GET /api/health → Complete health check of all services'
        )
        .setVersion('1.0')
        .addTag('votes', 'Endpoints for voting operations')
        .addTag('stats', 'Endpoints for statistics and metrics')
        .addTag('health', 'Endpoints for health checks')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
    Logger.log(
        `📚 Swagger documentation available at: http://localhost:${port}/${globalPrefix}/docs`
    );
}

bootstrap();
