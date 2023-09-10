'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { OfflineApiProvider } from './offline-api-context';

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <OfflineApiProvider>{children}</OfflineApiProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
};
