'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

const client = new QueryClient();

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};
