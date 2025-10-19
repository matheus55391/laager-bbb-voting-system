import { ParticipantStats } from '../types/participant';

export interface SubmitVoteRequest {
    participantId: string;
    userId?: string;
}

export interface SubmitVoteResponse {
    message: string;
    voteId: string;
    timestamp: string;
}

export interface GetResultsResponse {
    totalVotes: number;
    results: VoteResult[];
    lastUpdated: string;
}

export interface VoteResult {
    participantId: string;
    votes: number;
    percentage: number;
}

export interface GetFormattedResultsResponse {
    totalVotes: number;
    participants: ParticipantStats[];
    lastUpdated: string;
}
