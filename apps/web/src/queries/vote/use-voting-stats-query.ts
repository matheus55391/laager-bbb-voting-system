import { useQuery } from '@tanstack/react-query';
import { votingApi } from '../../services/voting.service';

export function useVotingStatsQuery() {
    return useQuery({
        queryKey: ['voting-results'],
        queryFn: () => votingApi.getFormattedResults(),
        // refetchInterval: 5000, // Atualiza a cada 5 segundos
        // staleTime: 3000, // Considera os dados obsoletos após 3 segundos
        refetchInterval: 30000, // Atualiza a cada 30 segundos (reduz logs)
        staleTime: 20000, // Considera os dados obsoletos após 20 segundos
        refetchOnWindowFocus: false, // Não atualiza ao focar na janela
    });
}
