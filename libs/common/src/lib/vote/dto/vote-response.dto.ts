import { ApiProperty } from '@nestjs/swagger';

export class VoteResponseDto {
    @ApiProperty({
        description: 'Mensagem de sucesso',
        example: 'Voto registrado com sucesso',
    })
    message!: string;

    @ApiProperty({
        description: 'ID do voto',
        example: 'vote-789',
    })
    voteId!: string;

    @ApiProperty({
        description: 'Timestamp do voto',
        example: '2025-10-16T10:30:00.000Z',
    })
    timestamp!: string;
}
