import apiClient from '../lib/api-client';
import type {
    SubmitVoteRequest,
    SubmitVoteResponse,
    GetResultsResponse,
    GetFormattedResultsResponse,
} from './voting.service.dto';

export const votingApi = {
    submitVote: async (
        data: SubmitVoteRequest
    ): Promise<SubmitVoteResponse> => {
        const response = await apiClient.post<SubmitVoteResponse>(
            '/votes',
            data
        );
        return response.data;
    },

    getResults: async (): Promise<GetResultsResponse> => {
        const response = await apiClient.get<GetResultsResponse>(
            '/votes/results'
        );
        return response.data;
    },

    getFormattedResults: async (): Promise<GetFormattedResultsResponse> => {
        const response = await votingApi.getResults();

        return {
            totalVotes: response.totalVotes,
            participants: response.results.map((result) => ({
                id: result.participantId,
                name: `Participante ${result.participantId.substring(0, 8)}`,
                votes: result.votes,
                percentage: result.percentage,
                imageUrl: undefined,
            })),
            lastUpdated: response.lastUpdated,
        };
    },
};
