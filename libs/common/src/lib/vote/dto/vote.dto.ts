import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VoteDto {
    @ApiProperty({
        description: 'ID do participante a ser votado',
        example: 'participant-123',
    })
    @IsNotEmpty()
    @IsString()
    participantId!: string;

    @ApiProperty({
        description: 'ID do usuário votante (opcional)',
        example: 'user-456',
        required: false,
    })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty({
        description: 'Endereço IP do votante (preenchido pelo servidor)',
        example: '192.168.1.1',
        required: false,
    })
    @IsOptional()
    @IsString()
    ipAddress?: string;

    @ApiProperty({
        description: 'User-Agent do navegador (preenchido pelo servidor)',
        example: 'Mozilla/5.0...',
        required: false,
    })
    @IsOptional()
    @IsString()
    userAgent?: string;
}
