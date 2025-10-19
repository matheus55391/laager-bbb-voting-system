import { ApiProperty } from '@nestjs/swagger';

export class TopParticipant {
    @ApiProperty({
        description: 'ID do participante',
        example: 'participant-123',
    })
    participantId!: string;

    @ApiProperty({
        description: 'Nome do participante',
        example: 'João Silva',
    })
    name!: string;

    @ApiProperty({
        description: 'Número de votos',
        example: 1500,
    })
    votes!: number;

    @ApiProperty({
        description: 'Percentual de votos',
        example: 45.5,
    })
    percentage!: number;
}

export class StatsResponseDto {
    @ApiProperty({
        description: 'Total de votos',
        example: 3300,
    })
    totalVotes!: number;

    @ApiProperty({
        description: 'Votos por segundo',
        example: 12.5,
    })
    votesPerSecond!: number;

    @ApiProperty({
        description: 'Votos por minuto',
        example: 750,
    })
    votesPerMinute!: number;

    @ApiProperty({
        description: 'Votos por hora',
        example: 45000,
    })
    votesPerHour!: number;

    @ApiProperty({
        description: 'Horário de pico de votação',
        example: '2025-10-16T20:00:00.000Z',
        nullable: true,
    })
    peakVotingTime!: string | null;

    @ApiProperty({
        description: 'Top participantes',
        type: [TopParticipant],
    })
    topParticipants!: TopParticipant[];

    @ApiProperty({
        description: 'Timestamp da última atualização',
        example: '2025-10-16T10:30:00.000Z',
    })
    lastUpdated!: string;
}
