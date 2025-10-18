import { Card } from '@/components/ui/card';

interface VotesPerHourChartProps {
    data: Array<{
        hour: string;
        votes: number;
    }>;
}

export function VotesPerHourChart({ data }: VotesPerHourChartProps) {
    const maxVotes = Math.max(...data.map((item) => item.votes));

    return (
        <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Votos por Hora
            </h2>

            <div className="space-y-4">
                {data.map((item) => {
                    const percentage = (item.votes / maxVotes) * 100;

                    return (
                        <div
                            key={item.hour}
                            className="flex items-center gap-4"
                        >
                            <span className="text-sm font-medium text-gray-700 w-20">
                                {item.hour}
                            </span>
                            <div className="flex-1 relative">
                                <div className="bg-gray-200 h-8 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full flex items-center justify-end pr-3 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {percentage > 15 && (
                                            <span className="text-sm font-semibold text-white">
                                                {item.votes.toLocaleString(
                                                    'pt-BR'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {percentage <= 15 && (
                                <span className="text-sm font-semibold text-gray-700 w-24 text-right">
                                    {item.votes.toLocaleString('pt-BR')}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
