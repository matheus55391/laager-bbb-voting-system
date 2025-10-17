import { Body, Controller, Get, Post, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VoteDto } from '../dto/vote.dto';
import { VoteResponseDto } from '../dto/vote-response.dto';
import { ResultsResponseDto } from '../dto/results-response.dto';
import { firstValueFrom } from 'rxjs';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo voto' })
  @ApiResponse({
    status: 201,
    description: 'Voto registrado com sucesso',
    type: VoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async vote(@Body() voteDto: VoteDto): Promise<VoteResponseDto> {
    const voteId = `vote-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Enviar voto para o RabbitMQ
    this.rabbitClient.emit('vote_submitted', {
      voteId,
      ...voteDto,
      timestamp,
    });

    return {
      message: 'Voto registrado com sucesso',
      voteId,
      timestamp,
    };
  }

  @Get('results')
  @ApiOperation({ summary: 'Obter resultados da votação' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da votação',
    type: ResultsResponseDto,
  })
  async getResults(): Promise<ResultsResponseDto> {
    // Solicitar resultados do aggregate-service via RabbitMQ
    try {
      const results = await firstValueFrom(
        this.rabbitClient.send('get_results', {})
      );
      return results;
    } catch {
      // Retornar resultado vazio se o serviço não estiver disponível
      return {
        totalVotes: 0,
        results: [],
        lastUpdated: new Date().toISOString(),
      };
    }
  }
}
