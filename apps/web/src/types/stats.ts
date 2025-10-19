import { ParticipantStats } from './participant';

export interface VotingStats {
    totalVotes: number;
    participants: ParticipantStats[];
    lastUpdated?: string;
}

export interface VotesPerHour {
    hour: string;
    votes: number;
}

export interface DashboardStats {
    totalVotes: number;
    votesPerHour: VotesPerHour[];
    topParticipants: ParticipantStats[];
}
