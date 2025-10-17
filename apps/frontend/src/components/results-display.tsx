'use client';

import { useResults } from '../hooks/use-votes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, Users, Clock, XCircle } from 'lucide-react';

const participants = [
  { id: 'participante-1', name: 'Participante 1' },
  { id: 'participante-2', name: 'Participante 2' },
  { id: 'participante-3', name: 'Participante 3' },
];

export function ResultsDisplay() {
  const { data: results, isLoading, isError, error } = useResults();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📊 Resultados da Votação</CardTitle>
          <CardDescription>Carregando resultados em tempo real...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📊 Resultados da Votação</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar resultados: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">📊 Resultados da Votação</CardTitle>
        <CardDescription>Acompanhe os votos em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">
            Total de votos: <Badge variant="secondary" className="text-base">{results.totalVotes}</Badge>
          </span>
        </div>

        <div className="space-y-4">
          {results.results
            .sort((a, b) => b.votes - a.votes)
            .map((result, index) => {
              const participant = participants.find(
                (p) => p.id === result.participantId
              );
              const isLeader = index === 0 && results.totalVotes > 0;

              return (
                <div
                  key={result.participantId}
                  className={`relative border rounded-lg p-4 transition-all ${
                    isLeader
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card'
                  }`}
                >
                  {isLeader && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="default" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Líder
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {participant?.name || result.participantId}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {result.votes}
                        </div>
                        <div className="text-xs text-muted-foreground">votos</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Percentual</span>
                        <span className="font-semibold">
                          {result.percentage.toFixed(2)}%
                        </span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
          <Clock className="h-4 w-4" />
          <span>
            Última atualização:{' '}
            {new Date(results.lastUpdated).toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
