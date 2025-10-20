import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VotingResultsProps {
    stats: {
        totalVotes: number;
        participants: Array<{
            id: string;
            name: string;
            votes: number;
            percentage: number;
        }>;
    };
}

export function VotingResults({ stats }: VotingResultsProps) {
    if (!stats || !stats.participants || stats.participants.length === 0) {
        return (
            <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Resultado Parcial
                </h2>
                <p className="text-center text-gray-600">
                    Nenhum voto registrado ainda. Seja o primeiro a votar!
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Resultado Parcial
            </h2>

            <div className="mb-6 text-center">
                <p className="text-lg text-gray-600">Total de votos</p>
                <p className="text-4xl font-bold text-gray-900">
                    {stats.totalVotes.toLocaleString('pt-BR')}
                </p>
            </div>

            <div className="space-y-6">
                {stats.participants.map((participant) => (
                    <div key={participant.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-800">
                                {participant.name}
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                                {participant.percentage.toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            value={participant.percentage}
                            className="h-4"
                        />
                        <p className="text-sm text-gray-600 text-right">
                            {participant.votes.toLocaleString('pt-BR')} votos
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
