export interface Vote {
    id: string;
    participantId: string;
    userId?: string;
    timestamp: Date;
}

export interface VoteStats {
    participantId: string;
    votes: number;
    percentage: number;
}
