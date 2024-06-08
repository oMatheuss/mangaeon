import type { Metadata } from 'next';
import { ThemeButton } from '@/components/theme-button';
import { PaletteIcon } from 'lucide-react';

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

export const metadata: Metadata = {
  title: 'Tema',
  description: 'Defina um tema para o site',
  robots: { index: false, follow: false },
};

export default function Theme() {
  return (
    <>
      <div className='mb-4 mt-8 flex'>
        <PaletteIcon className='mr-2 inline h-7 w-7 text-primary' />
        <h2 className='text-2xl font-bold'>Temas</h2>
      </div>
      <div className='mb-4 grid grid-cols-1 gap-4 font-sans sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {themes.map((theme) => {
          return (
            <ThemeButton
              key={theme}
              theme={theme}
              data-theme={theme}
              className='flex cursor-pointer rounded border border-base-content/20 shadow -outline-offset-2 outline-base-content/40 hover:outline focus:outline'
            >
              <div className='h-full basis-1/3 p-3 font-bold'>{theme}</div>
              <div className='flex h-full basis-1/3 items-center justify-center bg-base-200'>
                <span className='border-primary-focus h-5 w-5 rounded border bg-primary font-bold text-primary-content'>
                  P
                </span>
              </div>
              <div className='flex h-full basis-1/3 items-center justify-center bg-base-300'>
                <span className='border-secondary-focus h-5 w-5 rounded border bg-secondary font-bold text-secondary-content'>
                  S
                </span>
              </div>
            </ThemeButton>
          );
        })}
      </div>
    </>
  );
}
