import { VoteForm } from '../components/vote-form';
import { ResultsDisplay } from '../components/results-display';

export default function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        🗳️ Sistema de Votação BBB
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Vote no seu participante favorito em tempo real
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <VoteForm />
                    <ResultsDisplay />
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-card-foreground">
                        📡 Informações da API
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">
                                API Gateway:
                            </strong>{' '}
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                                http://localhost:3000/api
                            </code>
                        </p>
                        <p className="text-muted-foreground">
                            <strong className="text-foreground">
                                Swagger Docs:
                            </strong>{' '}
                            <a
                                href="http://localhost:3000/api/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                            >
                                Abrir Documentação →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
