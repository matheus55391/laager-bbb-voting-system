import { useQuery } from '@tanstack/react-query';

interface VotingStats {
    totalVotes: number;
    participants: Array<{
        id: string;
        name: string;
        votes: number;
        percentage: number;
    }>;
}

async function fetchVotingStats(): Promise<VotingStats> {
    const response = await fetch('http://localhost:3001/api/votes/stats');

    if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
    }

    return response.json();
}

export function useVotingStatsQuery() {
    return useQuery({
        queryKey: ['voting-stats'],
        queryFn: fetchVotingStats,
        refetchInterval: 5000, // Atualiza a cada 5 segundos
    });
}
