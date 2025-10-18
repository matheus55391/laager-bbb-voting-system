'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { VotingResults } from '@/components/voting/voting-results';
import { useVotingStatsQuery } from '@/queries/vote/use-voting-stats-query';
import { CheckCircle2 } from 'lucide-react';

export default function ResultPage() {
    const router = useRouter();
    const { data: stats, isLoading } = useVotingStatsQuery();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-20 h-20 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        VOTO CONFIRMADO!
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90">
                        Seu voto foi registrado com sucesso
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center text-white text-xl">
                        Carregando resultados...
                    </div>
                ) : stats ? (
                    <VotingResults stats={stats} />
                ) : (
                    <div className="text-center text-white text-xl">
                        Não foi possível carregar os resultados
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button
                        size="lg"
                        onClick={() => router.push('/')}
                        className="bg-white text-green-600 hover:bg-gray-100 text-xl px-8 py-6 rounded-full font-bold shadow-lg transform transition hover:scale-105"
                    >
                        VOTAR NOVAMENTE
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 text-xl px-8 py-6 rounded-full font-bold shadow-lg transform transition hover:scale-105"
                    >
                        VER DASHBOARD
                    </Button>
                </div>
            </div>
        </div>
    );
}
