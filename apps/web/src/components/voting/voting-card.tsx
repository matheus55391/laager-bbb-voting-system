import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface VotingCardProps {
    participant: {
        id: string;
        name: string;
        imageUrl: string;
    };
    isSelected: boolean;
    onSelect: () => void;
}

export function VotingCard({
    participant,
    isSelected,
    onSelect,
}: VotingCardProps) {
    return (
        <Card
            onClick={onSelect}
            className={cn(
                'relative cursor-pointer transition-all duration-300 overflow-hidden group',
                'hover:scale-105 hover:shadow-2xl',
                isSelected
                    ? 'ring-4 ring-white shadow-2xl scale-105'
                    : 'hover:ring-2 hover:ring-white/50'
            )}
        >
            <div className="relative aspect-[3/4] bg-gray-200">
                {/* Placeholder para imagem */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <span className="text-4xl font-bold text-gray-600">
                        {participant.name}
                    </span>
                </div>

                {/* Overlay quando selecionado */}
                {isSelected && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-full p-4">
                            <Check className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                )}

                {/* Nome do participante */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-3xl font-bold text-white text-center">
                        {participant.name}
                    </h3>
                </div>
            </div>
        </Card>
    );
}
