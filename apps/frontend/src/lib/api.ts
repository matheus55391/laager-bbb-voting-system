import {
  VoteFormData,
  VoteResponse,
  ResultsResponse,
  voteResponseSchema,
  resultsResponseSchema,
} from './schemas';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Função para enviar voto
export async function submitVote(data: VoteFormData): Promise<VoteResponse> {
  const response = await fetch(`${API_BASE_URL}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar voto');
  }

  const json = await response.json();
  return voteResponseSchema.parse(json);
}

// Função para buscar resultados
export async function fetchResults(): Promise<ResultsResponse> {
  const response = await fetch(`${API_BASE_URL}/votes/results`);

  if (!response.ok) {
    throw new Error('Erro ao buscar resultados');
  }

  const json = await response.json();
  return resultsResponseSchema.parse(json);
}
