import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly cacheService: CacheService) {}

  async aggregateVote(data: {
    voteId: string;
    participantId: string;
    userId?: string;
    timestamp: string;
  }): Promise<void> {
    this.logger.log(
      `Aggregating vote ${data.voteId} for participant ${data.participantId}`
    );

    await this.cacheService.incrementVote(data.participantId);

    this.logger.log(`Vote ${data.voteId} aggregated successfully`);
  }

  async getResults() {
    return this.cacheService.getResults();
  }
}
