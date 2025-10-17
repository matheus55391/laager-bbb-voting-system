import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('vote_processed')
  async handleVoteProcessed(
    @Ctx() context: RmqContext,
    data: {
      voteId: string;
      participantId: string;
      userId?: string;
      timestamp: string;
    }
  ) {
    this.logger.log(`Received processed vote: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.appService.aggregateVote(data);
      channel.ack(originalMsg);
      this.logger.log(`Vote ${data.voteId} aggregated successfully`);
    } catch (error) {
      this.logger.error(`Error aggregating vote ${data.voteId}:`, error);
      channel.nack(originalMsg, false, false);
    }
  }

  @MessagePattern('get_results')
  async handleGetResults() {
    this.logger.log('Received request for results');
    return this.appService.getResults();
  }
}
