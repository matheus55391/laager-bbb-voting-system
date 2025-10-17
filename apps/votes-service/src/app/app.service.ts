import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('AGGREGATE_SERVICE') private readonly aggregateClient: ClientProxy
  ) {}

  async processVote(data: {
    voteId: string;
    participantId: string;
    userId?: string;
    timestamp: string;
  }): Promise<void> {
    this.logger.log(`Processing vote for participant: ${data.participantId}`);

    // Encaminhar voto processado para o aggregate-service
    this.aggregateClient.emit('vote_processed', data);

    this.logger.log(`Vote ${data.voteId} forwarded to aggregate service`);
  }
}
