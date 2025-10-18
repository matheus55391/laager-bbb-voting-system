export interface Participant {
    id: string;
    name: string;
    imageUrl: string;
}

export interface Vote {
    id: string;
    participantId: string;
    timestamp: Date;
}

export interface VotingStats {
    totalVotes: number;
    participants: ParticipantStats[];
}

export interface ParticipantStats {
    id: string;
    name: string;
    votes: number;
    percentage: number;
}

export interface VotesPerHour {
    hour: string;
    votes: number;
}

export interface VoteDto {
    participantId: string;
}

export interface VoteResponse {
    success: boolean;
    message: string;
}
