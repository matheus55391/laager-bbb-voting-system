import { useMutation, useQueryClient } from '@tanstack/react-query';
import { votingApi } from '../../services/voting.service';
import type {
    SubmitVoteRequest,
    SubmitVoteResponse,
} from '../../services/voting.service.dto';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
    message: string;
    statusCode?: number;
}

export function useVoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitVoteRequest) => votingApi.submitVote(data),
        onSuccess: (data: SubmitVoteResponse) => {
            // Invalida as queries para atualizar os resultados
            queryClient.invalidateQueries({ queryKey: ['voting-results'] });

            toast.success('Voto registrado com sucesso!', {
                description: `ID do voto: ${data.voteId}`,
            });
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
