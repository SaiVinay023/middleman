'use client';

import { 
  QueryClient, 
  QueryClientProvider, 
  QueryCache, 
  MutationCache 
} from '@tanstack/react-query';
import { useState } from 'react';
import { logDataError } from '@/lib/errorTracking';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    // 1. Move Global Query Errors here
    queryCache: new QueryCache({
      onError: (error) => {
        logDataError(error as Error, 'global_query_cache');
      },
    }),
    
    // 2. Move Global Mutation Errors here
    mutationCache: new MutationCache({
      onError: (error) => {
        logDataError(error as Error, 'global_mutation_cache');
      },
    }),

    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        // ✅ 'onError' is no longer allowed here in v5
      },
      mutations: {
        retry: 1,
        // ✅ 'onError' is no longer allowed here in v5
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}