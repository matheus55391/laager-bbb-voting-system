import { useMutation, useQueryClient } from '@tanstack/react-query';
import { votingService } from '../../services/voting.service';
import type { SubmitVoteRequest } from '../../services/voting.service.dto';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
    message: string;
    statusCode?: number;
}

export function useVoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitVoteRequest) => votingService.submitVote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voting-results'] });
            queryClient.invalidateQueries({ queryKey: ['participants'] });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            const errorMessage =
                error.response?.data?.message || 'Erro ao registrar voto';
            toast.error('Erro ao votar', {
                description: errorMessage,
            });
        },
    });
}
