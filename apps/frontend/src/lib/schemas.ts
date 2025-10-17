import { z } from 'zod';

// Schema para votação
export const voteSchema = z.object({
  participantId: z.string().min(1, 'Selecione um participante'),
  userId: z.string().optional(),
});

export type VoteFormData = z.infer<typeof voteSchema>;

// Schemas para tipos de resposta da API
export const participantResultSchema = z.object({
  participantId: z.string(),
  votes: z.number(),
  percentage: z.number(),
});

export const resultsResponseSchema = z.object({
  totalVotes: z.number(),
  results: z.array(participantResultSchema),
  lastUpdated: z.string(),
});

export const voteResponseSchema = z.object({
  message: z.string(),
  voteId: z.string(),
  timestamp: z.string(),
});

export type ParticipantResult = z.infer<typeof participantResultSchema>;
export type ResultsResponse = z.infer<typeof resultsResponseSchema>;
export type VoteResponse = z.infer<typeof voteResponseSchema>;
