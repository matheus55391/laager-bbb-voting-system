import './global.css';
import { QueryProvider } from '../providers/query-provider';

export const metadata = {
  title: 'Sistema de Votação BBB',
  description: 'Sistema de votação em tempo real para Big Brother Brasil',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
