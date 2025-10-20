import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VotesChartProps {
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

export function VotesChart({ stats }: VotesChartProps) {
    const hasParticipants = stats.participants && stats.participants.length > 0;

    return (
        <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Distribuição de Votos por Participante
            </h2>

            {hasParticipants ? (
                <div className="space-y-6">
                    {stats.participants.map((participant) => (
                        <div key={participant.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">
                                    {participant.name}
                                </span>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-gray-900">
                                        {participant.percentage.toFixed(2)}%
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        {participant.votes.toLocaleString(
                                            'pt-BR'
                                        )}{' '}
                                        votos
                                    </p>
                                </div>
                            </div>
                            <Progress
                                value={participant.percentage}
                                className="h-6"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">
                        Nenhum voto registrado ainda.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Os dados aparecerão aqui assim que os votos começarem a
                        ser contabilizados.
                    </p>
                </div>
            )}
        </Card>
    );
}
