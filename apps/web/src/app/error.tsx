'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
                    Erro
                </h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Algo deu errado!
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Ocorreu um erro inesperado. Por favor, tente novamente.
                </p>
                <button
                    onClick={reset}
                    className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
