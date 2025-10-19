'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VotingCard } from '@/components/voting/voting-card';
import { Button } from '@/components/ui/button';
import { useVoteMutation } from '@/queries/vote/use-vote-mutation';
import { useParticipantsQuery } from '@/queries/vote/use-participants-query';
import { toast } from 'sonner';

export default function Home() {
    const router = useRouter();
    const [selectedParticipant, setSelectedParticipant] = useState<
        string | null
    >(null);
    const voteMutation = useVoteMutation();
    const { data: participants, isLoading } = useParticipantsQuery();

    const handleVote = async () => {
        if (!selectedParticipant) {
            toast.error('Por favor, selecione um participante para votar');
            return;
        }

        try {
            await voteMutation.mutateAsync({
                participantId: selectedParticipant,
            });

            toast.success('Voto registrado com sucesso!');
            router.push('/result');
        } catch {
            toast.error('Erro ao registrar voto. Tente novamente.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex items-center justify-center">
                <p className="text-white text-2xl">
                    Carregando participantes...
                </p>
            </div>
        );
    }

    if (!participants || participants.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-2xl mb-4">
                        Nenhum participante disponível
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-white text-red-600"
                    >
                        Recarregar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex flex-col items-center justify-center p-4">
            <div className="max-w-6xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        PAREDÃO BBB
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90">
                        Vote no participante que você quer ELIMINAR
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {participants.map((participant) => (
                        <VotingCard
                            key={participant.id}
                            participant={{
                                id: participant.id,
                                name: participant.name,
                                imageUrl: `/images/participant-placeholder.jpg`,
                            }}
                            isSelected={selectedParticipant === participant.id}
                            onSelect={() =>
                                setSelectedParticipant(participant.id)
                            }
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Button
                        size="lg"
                        onClick={handleVote}
                        disabled={
                            !selectedParticipant || voteMutation.isPending
                        }
                        className="bg-white text-red-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-full font-bold shadow-lg transform transition hover:scale-105"
                    >
                        {voteMutation.isPending
                            ? 'VOTANDO...'
                            : 'CONFIRMAR VOTO'}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                        className="text-white hover:bg-white/20 text-lg"
                    >
                        Ver Dashboard de Resultados
                    </Button>
                </div>
            </div>
        </div>
    );
}
