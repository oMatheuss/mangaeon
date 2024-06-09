'use client';

import React, { useState } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <JotaiProvider>{children}</JotaiProvider>;
    </QueryClientProvider>
  );
};
