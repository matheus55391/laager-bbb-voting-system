import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
                    404
                </h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Página não encontrada
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Desculpe, não conseguimos encontrar a página que você está
                    procurando.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
                >
                    Voltar para a página inicial
                </Link>
            </div>
        </div>
    );
}
