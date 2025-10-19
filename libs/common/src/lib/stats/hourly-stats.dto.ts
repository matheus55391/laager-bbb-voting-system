import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para estatísticas de votos por hora
 */
export class HourlyStatsDto {
    @ApiProperty({
        description: 'Hora do período (formato ISO 8601)',
        example: '2025-10-18T14:00:00.000Z',
    })
    hour: string;

    @ApiProperty({
        description: 'Total de votos nesta hora',
        example: 3500,
    })
    votes: number;
}

/**
 * DTO de resposta para estatísticas horárias
 */
export class HourlyStatsResponseDto {
    @ApiProperty({
        description: 'Estatísticas de votos agrupadas por hora',
        type: [HourlyStatsDto],
    })
    hourlyStats: HourlyStatsDto[];

    @ApiProperty({
        description: 'Total geral de votos',
        example: 15000,
    })
    totalVotes: number;

    @ApiProperty({
        description: 'Data/hora da última atualização',
        example: '2025-10-18T15:30:45.123Z',
    })
    lastUpdated: string;
}
