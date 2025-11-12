'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function ThemeSelector() {
  const [theme, setTheme] = useState<string>('');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') ?? '');
  }, []);

  const handleChangeTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setTheme(theme);
  };

  return (
    <Select value={theme} onValueChange={handleChangeTheme}>
      <SelectTrigger>
        <SelectValue placeholder='Select a theme' />
      </SelectTrigger>
      <SelectContent>
        {themes.map((item) => (
          <SelectItem key={item} value={item}>
            <div className='mr-2 inline-block align-middle'>
              <div
                data-theme={item}
                className='grid shrink-0 grid-cols-2 gap-0.5 rounded-md bg-base-100 p-1 shadow-sm'
              >
                <div className='size-1 rounded-full bg-base-content'></div>
                <div className='size-1 rounded-full bg-primary'></div>
                <div className='size-1 rounded-full bg-secondary'></div>
                <div className='size-1 rounded-full bg-accent'></div>
              </div>
            </div>
            <span>{item}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
];
