import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    VoteDto,
    VoteResponseDto,
    ResultsResponseDto,
    HourlyStatsResponseDto,
} from '@laager-bbb-voting-system/common';
import { VotesService } from './services/votes.service';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(private readonly votesService: VotesService) {}

    /**
     * Handler para processar votos recebidos da fila 'votes_queue'
     * Pattern: 'vote.create' (mensagem publicada pelo API Gateway)
     */
    @MessagePattern('vote.create')
    async handleVote(@Payload() voteDto: VoteDto): Promise<VoteResponseDto> {
        this.logger.log(`Received vote message: ${JSON.stringify(voteDto)}`);
        return await this.votesService.processVote(voteDto);
    }

    /**
     * Handler para consultas de status da votação
     * Pattern: 'vote.getStatus' (request/reply do API Gateway)
     */
    @MessagePattern('vote.getStatus')
    async handleGetStatus(): Promise<ResultsResponseDto> {
        this.logger.log('Received status request');
        return await this.votesService.getVotingStatus();
    }

    /**
     * Handler para estatísticas horárias
     * Pattern: 'vote.getHourlyStats' (request/reply do API Gateway)
     * Requisito Laager: consultar total de votos por hora
     */
    @MessagePattern('vote.getHourlyStats')
    async handleGetHourlyStats(): Promise<HourlyStatsResponseDto> {
        this.logger.log('Received hourly stats request');
        return await this.votesService.getHourlyStats();
    }
}
