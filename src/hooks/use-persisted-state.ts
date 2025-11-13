'use client';

import { useEffect, useState } from 'react';

export function usePersistedState(
  defaultValue: string,
  key: string
): [string, (value: string) => void] {
  const [value, _setValue] = useState(defaultValue);

  useEffect(() => {
    const _value = localStorage.getItem(key);
    _setValue(_value !== null ? _value : defaultValue);
  }, []);

  const setValue = (value: string) => {
    _setValue(value);
    localStorage.setItem(key, value);
  };

  return [value, setValue];
}
