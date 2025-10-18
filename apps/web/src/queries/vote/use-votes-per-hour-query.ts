import { useQuery } from '@tanstack/react-query';

interface VotesPerHour {
    hour: string;
    votes: number;
}

async function fetchVotesPerHour(): Promise<VotesPerHour[]> {
    const response = await fetch('http://localhost:3001/api/votes/per-hour');

    if (!response.ok) {
        throw new Error('Erro ao buscar votos por hora');
    }

    return response.json();
}

export function useVotesPerHourQuery() {
    return useQuery({
        queryKey: ['votes-per-hour'],
        queryFn: fetchVotesPerHour,
        refetchInterval: 10000, // Atualiza a cada 10 segundos
    });
}
