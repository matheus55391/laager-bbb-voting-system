'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { VotesChart } from '@/components/dashboard/votes-chart';
import { VotesPerHourChart } from '@/components/dashboard/votes-per-hour-chart';
import { useVotingStatsQuery } from '@/queries/vote/use-voting-stats-query';
import { useVotesPerHourQuery } from '@/queries/vote/use-votes-per-hour-query';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { data: stats, isLoading: isLoadingStats } = useVotingStatsQuery();
    const { data: votesPerHour, isLoading: isLoadingVotesPerHour } =
        useVotesPerHourQuery();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/')}
                                className="text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Dashboard - Paredão BBB
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {isLoadingStats ? (
                    <div className="text-center text-gray-600 text-xl py-12">
                        Carregando estatísticas...
                    </div>
                ) : stats ? (
                    <div className="space-y-8">
                        <DashboardStats stats={stats} />
                        <VotesChart stats={stats} />
                        {!isLoadingVotesPerHour &&
                            votesPerHour &&
                            votesPerHour.length > 0 && (
                                <VotesPerHourChart data={votesPerHour} />
                            )}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 text-xl py-12">
                        Não foi possível carregar as estatísticas
                    </div>
                )}
            </div>
        </div>
    );
}
