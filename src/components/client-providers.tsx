'use client';

import React from 'react';
import { Provider as JotaiProvider } from 'jotai';

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <JotaiProvider>{children}</JotaiProvider>;
};
