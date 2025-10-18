import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Clock } from 'lucide-react';

interface DashboardStatsProps {
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

export function DashboardStats({ stats }: DashboardStatsProps) {
    const leader = stats.participants.reduce((prev, current) =>
        prev.votes > current.votes ? prev : current
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total de Votos</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {stats.totalVotes.toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            Participante Líder
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            {leader.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {leader.percentage.toFixed(1)}% dos votos
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            Última atualização
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            {new Date().toLocaleTimeString('pt-BR')}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
