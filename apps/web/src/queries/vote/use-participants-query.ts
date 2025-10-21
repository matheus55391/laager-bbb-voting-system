import { useQuery } from '@tanstack/react-query';
import { votingService } from '../../services/voting.service';

export function useParticipantsQuery() {
    return useQuery({
        queryKey: ['participants'],
        queryFn: async () => {
            const results = await votingService.getResults();
            if (!results) {
                return [];
            }
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
