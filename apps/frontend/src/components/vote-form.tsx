'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voteSchema, VoteFormData } from '../lib/schemas';
import { useSubmitVote } from '../hooks/use-votes';
import styles from './vote-form.module.css';

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
    <div className={styles.voteSection}>
      <h2>Registrar Voto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="participantId">Selecione o Participante:</label>
          <select
            id="participantId"
            {...register('participantId')}
            className={styles.select}
            disabled={mutation.isPending}
          >
            <option value="">-- Escolha um participante --</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.participantId && (
            <span className={styles.error}>{errors.participantId.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userId">Seu ID (opcional):</label>
          <input
            type="text"
            id="userId"
            {...register('userId')}
            placeholder="Digite seu ID"
            className={styles.input}
            disabled={mutation.isPending}
          />
          {errors.userId && (
            <span className={styles.error}>{errors.userId.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Enviando...' : 'Votar Agora'}
        </button>

        {mutation.isSuccess && (
          <div className={styles.success}>✅ {mutation.data.message}</div>
        )}

        {mutation.isError && (
          <div className={styles.errorMessage}>
            ❌ {mutation.error.message || 'Erro ao registrar voto'}
          </div>
        )}
      </form>
    </div>
  );
}
