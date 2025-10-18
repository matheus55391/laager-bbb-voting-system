'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { makeQueryClient } from 'src/lib/query-client'

export interface TanstackQueryContextState {
  queryClient: QueryClient
}

const TanstackQueryClientContext = React.createContext<
  TanstackQueryContextState | undefined
>(undefined)

export function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = makeQueryClient()

  return (
    <TanstackQueryClientContext.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TanstackQueryClientContext.Provider>
  )
}

export const useReactQuery = () => {
  const context = React.useContext(TanstackQueryClientContext)
  if (!context) {
    throw new Error('useReactQuery must be used within a TanstackQueryProvider')
  }
  return context
}
