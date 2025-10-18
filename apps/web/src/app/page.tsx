'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VotingCard } from '@/components/voting/voting-card';
import { Button } from '@/components/ui/button';
import { useVoteMutation } from '@/queries/vote/use-vote-mutation';
import { toast } from 'sonner';

// Mock de participantes - será substituído pela API
const PARTICIPANTS = [
    {
        id: '1',
        name: 'Participante 1',
        imageUrl: '/images/participant-1.jpg',
    },
    {
        id: '2',
        name: 'Participante 2',
        imageUrl: '/images/participant-2.jpg',
    },
];

export default function Home() {
    const router = useRouter();
    const [selectedParticipant, setSelectedParticipant] = useState<
        string | null
    >(null);
    const voteMutation = useVoteMutation();

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
                    {PARTICIPANTS.map((participant) => (
                        <VotingCard
                            key={participant.id}
                            participant={participant}
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
