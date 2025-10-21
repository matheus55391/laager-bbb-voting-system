import { baseApiInstance } from '../lib/axios';
import { BackendApiService } from './backend-api-service';
import type {
    SubmitVoteRequest,
    SubmitVoteResponse,
    GetResultsResponse,
    GetFormattedResultsResponse,
} from './voting.service.dto';

export class VotingService extends BackendApiService {
    private readonly baseEndpoint = 'votes';

    async submitVote(
        data: SubmitVoteRequest
    ): Promise<SubmitVoteResponse | undefined> {
        const response = await this.post<SubmitVoteRequest, SubmitVoteResponse>(
            this.baseEndpoint,
            data
        );
        return response.data;
    }

    async getResults(): Promise<GetResultsResponse | undefined> {
        const response = await this.get<GetResultsResponse>(
            `${this.baseEndpoint}/results`
        );
        return response.data;
    }

    async getFormattedResults(): Promise<
        GetFormattedResultsResponse | undefined
    > {
        const results = await this.getResults();

        if (!results) {
            return undefined;
        }

        return {
            totalVotes: results.totalVotes,
            participants: results.results.map((result) => ({
                id: result.participantId,
                name: result.name,
                votes: result.votes,
                percentage: result.percentage,
                imageUrl: undefined,
            })),
            lastUpdated: results.lastUpdated,
        };
    }
}

export const votingService = new VotingService(baseApiInstance);
