'use client';

import { TanstackQueryProvider } from 'src/contexts/tanstack-query-provider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TanstackQueryProvider>
            {children}
            <Toaster />
        </TanstackQueryProvider>
    );
}
