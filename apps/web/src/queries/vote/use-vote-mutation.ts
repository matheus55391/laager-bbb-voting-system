import { useMutation } from '@tanstack/react-query';

interface VoteDto {
    participantId: string;
}

interface VoteResponse {
    success: boolean;
    message: string;
}

async function submitVote(data: VoteDto): Promise<VoteResponse> {
    const response = await fetch('http://localhost:3001/api/votes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Erro ao registrar voto');
    }

    return response.json();
}

export function useVoteMutation() {
    return useMutation({
        mutationFn: submitVote,
    });
}
