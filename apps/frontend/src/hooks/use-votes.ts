import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitVote, fetchResults } from '../lib/api';
import { VoteFormData } from '../lib/schemas';

// Hook para buscar resultados
export function useResults() {
  return useQuery({
    queryKey: ['results'],
    queryFn: fetchResults,
    refetchInterval: 5000, // Atualiza automaticamente a cada 5 segundos
  });
}

// Hook para enviar voto
export function useSubmitVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoteFormData) => submitVote(data),
    onSuccess: () => {
      // Invalida e recarrega os resultados após votar
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
}
