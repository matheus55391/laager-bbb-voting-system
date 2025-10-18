import { Providers } from './providers';
import './globals.css';

export const metadata = {
    title: 'BBB Voting System',
    description: 'Sistema de Votação do Paredão BBB',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="pt-BR"
            suppressContentEditableWarning
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
