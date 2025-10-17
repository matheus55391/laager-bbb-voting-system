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
}
