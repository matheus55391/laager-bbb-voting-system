import { useQuery } from '@tanstack/react-query';
import { votingApi } from '../../services/voting.service';

export function useParticipantsQuery() {
    return useQuery({
        queryKey: ['participants'],
        queryFn: async () => {
            const results = await votingApi.getResults();
            // Transforma os resultados em lista de participantes
            return results.results.map((result) => ({
                id: result.participantId,
                name: result.name,
                votes: result.votes,
                percentage: result.percentage,
            }));
        },
        staleTime: 60000, // Cache por 1 minuto
    });
}
