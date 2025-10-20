import { useQuery } from '@tanstack/react-query';
import { votingApi } from '../../services/voting.service';

export function useParticipantsQuery() {
    return useQuery({
        queryKey: ['participants'],
        queryFn: async () => {
            const results = await votingApi.getResults();
            return results.results.map((result) => ({
                id: result.participantId,
                name: result.name,
                votes: result.votes,
                percentage: result.percentage,
            }));
        },
        staleTime: 60000,
    });
}
