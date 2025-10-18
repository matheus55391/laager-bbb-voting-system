import { Controller, Logger, Get } from '@nestjs/common';
import {
    EventPattern,
    Ctx,
    RmqContext,
    MessagePattern,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern('vote_submitted')
    async handleVoteSubmitted(
        @Ctx() context: RmqContext,
        data: {
            voteId: string;
            participantId: string;
            userId?: string;
            ipAddress?: string;
            userAgent?: string;
            fingerprint?: string;
            timestamp: string;
        }
    ) {
        this.logger.log(`Received vote: ${JSON.stringify(data)}`);

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            await this.appService.processVote(data);
            channel.ack(originalMsg);
            this.logger.log(`Vote ${data.voteId} processed successfully`);
        } catch (error) {
            this.logger.error(`Error processing vote ${data.voteId}:`, error);
            channel.nack(originalMsg, false, false);
        }
    }

    @Get('health')
    health() {
        return this.appService.healthCheck();
    }

    @MessagePattern('get_votes_stats')
    getStats() {
        return this.appService.getStats();
    }
}
