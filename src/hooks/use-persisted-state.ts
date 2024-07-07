'use client';

import { useState } from 'react';

export function usePersistedState(
  defaultValue: string,
  key: string
): [string, (value: string) => void] {
  const [value, _setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const _value = localStorage.getItem(key);
      return _value !== null ? _value : defaultValue;
    } else {
      return defaultValue;
    }
  });

  const setValue = (value: string) => {
    _setValue(value);
    localStorage.setItem(key, value);
  };

  return [value, setValue];
}
