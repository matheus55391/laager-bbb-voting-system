export interface Participant {
    id: string;
    name: string;
    imageUrl?: string;
}

export interface ParticipantCard {
    id: string;
    name: string;
    imageUrl: string;
}

export interface ParticipantStats extends Participant {
    votes: number;
    percentage: number;
}
