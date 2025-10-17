'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voteSchema, VoteFormData } from '../lib/schemas';
import { useSubmitVote } from '../hooks/use-votes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

const participants = [
    { id: 'participante-1', name: 'Participante 1' },
    { id: 'participante-2', name: 'Participante 2' },
    { id: 'participante-3', name: 'Participante 3' },
];

export function VoteForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<VoteFormData>({
        resolver: zodResolver(voteSchema),
    });

    const mutation = useSubmitVote();

    const onSubmit = async (data: VoteFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset();
        } catch (error) {
            console.error('Erro ao enviar voto:', error);
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-2xl">Registrar Voto</CardTitle>
                <CardDescription>
                    Escolha seu participante favorito e envie seu voto
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="participantId">
                            Selecione o Participante
                        </Label>
                        <Select
                            disabled={mutation.isPending}
                            onValueChange={(value) =>
                                setValue('participantId', value)
                            }
                        >
                            <SelectTrigger
                                id="participantId"
                                className={
                                    errors.participantId
                                        ? 'border-destructive'
                                        : ''
                                }
                            >
                                <SelectValue placeholder="-- Escolha um participante --" />
                            </SelectTrigger>
                            <SelectContent>
                                {participants.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.participantId && (
                            <p className="text-sm text-destructive">
                                {errors.participantId.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userId">Seu ID (opcional)</Label>
                        <Input
                            type="text"
                            id="userId"
                            {...register('userId')}
                            placeholder="Digite seu ID"
                            disabled={mutation.isPending}
                            className={
                                errors.userId ? 'border-destructive' : ''
                            }
                        />
                        {errors.userId && (
                            <p className="text-sm text-destructive">
                                {errors.userId.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={mutation.isPending}
                        size="lg"
                    >
                        {mutation.isPending ? 'Enviando...' : 'Votar Agora 🗳️'}
                    </Button>

                    {mutation.isSuccess && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                {mutation.data.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {mutation.isError && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>
                                {mutation.error.message ||
                                    'Erro ao registrar voto'}
                            </AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
