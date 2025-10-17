'use client';

import { useResults } from '../hooks/use-votes';
import styles from './results-display.module.css';

const participants = [
  { id: 'participante-1', name: 'Participante 1' },
  { id: 'participante-2', name: 'Participante 2' },
  { id: 'participante-3', name: 'Participante 3' },
];

export function ResultsDisplay() {
  const { data: results, isLoading, isError, error } = useResults();

  if (isLoading) {
    return (
      <div className={styles.resultsSection}>
        <h2>📊 Resultados da Votação</h2>
        <div className={styles.loading}>Carregando resultados...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.resultsSection}>
        <h2>📊 Resultados da Votação</h2>
        <div className={styles.error}>
          ❌ Erro ao carregar resultados: {error.message}
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className={styles.resultsSection}>
      <h2>📊 Resultados da Votação</h2>
      <div className={styles.totalVotes}>
        <strong>Total de votos:</strong> {results.totalVotes}
      </div>
      <div className={styles.resultsGrid}>
        {results.results.map((result) => {
          const participant = participants.find(
            (p) => p.id === result.participantId
          );
          return (
            <div key={result.participantId} className={styles.resultCard}>
              <h3>{participant?.name || result.participantId}</h3>
              <div className={styles.votes}>
                <span className={styles.voteCount}>{result.votes}</span>
                <span className={styles.voteLabel}>votos</span>
              </div>
              <div className={styles.percentage}>
                {result.percentage.toFixed(2)}%
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.lastUpdated}>
        Última atualização:{' '}
        {new Date(results.lastUpdated).toLocaleTimeString('pt-BR')}
      </div>
    </div>
  );
}
