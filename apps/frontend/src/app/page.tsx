import { VoteForm } from '../components/vote-form';
import { ResultsDisplay } from '../components/results-display';
import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>🗳️ Sistema de Votação BBB</h1>

        <div className={styles.content}>
          <VoteForm />
          <ResultsDisplay />
        </div>

        <div className={styles.info}>
          <p>
            <strong>API Gateway:</strong> http://localhost:3000/api
          </p>
          <p>
            <strong>Swagger Docs:</strong>{' '}
            <a
              href="http://localhost:3000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir Documentação
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
