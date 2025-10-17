import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

interface VoteData {
  participantId: string;
  votes: number;
}

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);
  private cache: Map<string, number> = new Map();
  private lastUpdated: Date = new Date();

  onModuleInit() {
    this.logger.log('Cache Service initialized with in-memory storage');
  }

  async incrementVote(participantId: string): Promise<void> {
    const currentVotes = this.cache.get(participantId) || 0;
    this.cache.set(participantId, currentVotes + 1);
    this.lastUpdated = new Date();
    this.logger.debug(
      `Incremented vote for ${participantId}: ${currentVotes + 1}`
    );
  }

  async getResults(): Promise<{
    totalVotes: number;
    results: Array<{
      participantId: string;
      votes: number;
      percentage: number;
    }>;
    lastUpdated: string;
  }> {
    const results: VoteData[] = [];
    let totalVotes = 0;

    this.cache.forEach((votes, participantId) => {
      results.push({ participantId, votes });
      totalVotes += votes;
    });

    // Calcular percentuais
    const resultsWithPercentage = results.map((result) => ({
      participantId: result.participantId,
      votes: result.votes,
      percentage: totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0,
    }));

    // Ordenar por número de votos (decrescente)
    resultsWithPercentage.sort((a, b) => b.votes - a.votes);

    return {
      totalVotes,
      results: resultsWithPercentage,
      lastUpdated: this.lastUpdated.toISOString(),
    };
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    this.lastUpdated = new Date();
    this.logger.log('Cache cleared');
  }
}
