import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResult {
  @ApiProperty({
    description: 'ID do participante',
    example: 'participant-123',
  })
  participantId!: string;

  @ApiProperty({
    description: 'Número de votos recebidos',
    example: 1500,
  })
  votes!: number;

  @ApiProperty({
    description: 'Percentual de votos',
    example: 45.5,
  })
  percentage!: number;
}

export class ResultsResponseDto {
  @ApiProperty({
    description: 'Total de votos computados',
    example: 3300,
  })
  totalVotes!: number;

  @ApiProperty({
    description: 'Resultados por participante',
    type: [ParticipantResult],
  })
  results!: ParticipantResult[];

  @ApiProperty({
    description: 'Timestamp da última atualização',
    example: '2025-10-16T10:30:00.000Z',
  })
  lastUpdated!: string;
}
