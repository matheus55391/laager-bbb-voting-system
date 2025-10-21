import { useQuery } from '@tanstack/react-query';
import { votingService } from '../../services/voting.service';

export function useVotingStatsQuery() {
    return useQuery({
        queryKey: ['voting-results'],
        queryFn: () => votingService.getFormattedResults(),
        refetchInterval: 30000,
        staleTime: 20000,
        refetchOnWindowFocus: false,
    });
}
