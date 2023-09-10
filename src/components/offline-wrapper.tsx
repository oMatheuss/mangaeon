'use client';

import { useEffect, useState } from 'react';

interface OfflineWrapperProps {
  children: React.ReactNode;
}

export const OfflineWrapper = ({ children }: OfflineWrapperProps) => {
  const [offline, setOffline] = useState(false);

  const setOn = () => setOffline(false);
  const setOff = () => setOffline(true);

  useEffect(() => {
    window.addEventListener('online', setOn);
    window.addEventListener('offline', setOff);

    return () => {
      window.removeEventListener('online', setOn);
      window.removeEventListener('offline', setOff);
    };
  }, []);

  if (offline) return children;
  else return null;
};
