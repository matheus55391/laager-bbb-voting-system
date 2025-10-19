import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';

interface ServiceHealth {
    status: 'ok' | 'unavailable' | 'error';
    message?: string;
}

interface HealthCheckResponse {
    status: 'ok' | 'degraded' | 'error';
    timestamp: string;
    services: {
        apiGateway: ServiceHealth;
        rabbitmq: ServiceHealth;
        votingService: ServiceHealth;
        statsService: ServiceHealth;
    };
}

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
        private readonly httpService: HttpService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Verificar status geral do sistema' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Status de todos os serviços',
    })
    async checkHealth(): Promise<HealthCheckResponse> {
        const results = await Promise.allSettled([
            this.checkRabbitMQ(),
            this.checkVotingService(),
            this.checkStatsService(),
        ]);

        const rabbitmqHealth =
            results[0].status === 'fulfilled'
                ? results[0].value
                : {
                      status: 'error' as const,
                      message: 'Failed to check RabbitMQ',
                  };

        const votingServiceHealth =
            results[1].status === 'fulfilled'
                ? results[1].value
                : {
                      status: 'error' as const,
                      message: 'Failed to check Voting Service',
                  };

        const statsServiceHealth =
            results[2].status === 'fulfilled'
                ? results[2].value
                : {
                      status: 'error' as const,
                      message: 'Failed to check Stats Service',
                  };

        const allOk = [
            rabbitmqHealth,
            votingServiceHealth,
            statsServiceHealth,
        ].every((service) => service.status === 'ok');

        const anyError = [
            rabbitmqHealth,
            votingServiceHealth,
            statsServiceHealth,
        ].some((service) => service.status === 'error');

        return {
            status: allOk ? 'ok' : anyError ? 'error' : 'degraded',
            timestamp: new Date().toISOString(),
            services: {
                apiGateway: { status: 'ok' },
                rabbitmq: rabbitmqHealth,
                votingService: votingServiceHealth,
                statsService: statsServiceHealth,
            },
        };
    }

    @Get('simple')
    @ApiOperation({ summary: 'Verificar status simples do API Gateway' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Serviço operacional',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
            },
        },
    })
    checkSimpleHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    private async checkRabbitMQ(): Promise<ServiceHealth> {
        try {
            // Tentar enviar uma mensagem de ping
            await firstValueFrom(
                this.rabbitClient.send('health_check', {}).pipe(
                    timeout(2000),
                    catchError(() => of({ status: 'unavailable' }))
                )
            );
            return { status: 'ok' };
        } catch (error) {
            return {
                status: 'unavailable',
                message: 'RabbitMQ not responding',
            };
        }
    }

    private async checkVotingService(): Promise<ServiceHealth> {
        const votingServiceUrl =
            process.env.VOTING_SERVICE_URL || 'http://localhost:3002/health';

        try {
            await firstValueFrom(
                this.httpService.get(votingServiceUrl).pipe(
                    timeout(2000),
                    catchError(() => {
                        throw new Error('Service unavailable');
                    })
                )
            );
            return { status: 'ok' };
        } catch (error) {
            return {
                status: 'unavailable',
                message: 'Voting Service not responding',
            };
        }
    }

    private async checkStatsService(): Promise<ServiceHealth> {
        const statsServiceUrl =
            process.env.STATS_SERVICE_URL || 'http://localhost:3003/health';

        try {
            await firstValueFrom(
                this.httpService.get(statsServiceUrl).pipe(
                    timeout(2000),
                    catchError(() => {
                        throw new Error('Service unavailable');
                    })
                )
            );
            return { status: 'ok' };
        } catch (error) {
            return {
                status: 'unavailable',
                message: 'Stats Service not responding',
            };
        }
    }
}
