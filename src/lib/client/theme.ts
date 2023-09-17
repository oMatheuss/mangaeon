'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';

const themeAtom = atomWithStorage<string | null>('theme', null);

export const useTheme = () => {
  return useAtom(themeAtom);
};

export const ThemeApplier = () => {
  const [theme] = useTheme();
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return null;
};
