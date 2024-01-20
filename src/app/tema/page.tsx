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
};

export default function Theme() {
  return (
    <>
      <div className='flex mt-8 mb-4'>
        <PaletteIcon className='inline h-7 w-7 mr-2 text-primary' />
        <h2 className='font-bold text-2xl'>Temas</h2>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4 font-sans'>
        {themes.map((theme) => {
          return (
            <ThemeButton
              key={theme}
              theme={theme}
              data-theme={theme}
              className='flex border border-base-content/20 hover:outline focus:outline outline-base-content/40 -outline-offset-2 rounded shadow cursor-pointer'
            >
              <div className='basis-1/3 font-bold h-full p-3'>{theme}</div>
              <div className='basis-1/3 bg-base-200 flex items-center justify-center h-full'>
                <span className='bg-primary text-primary-content border border-primary-focus w-5 h-5 rounded font-bold'>
                  P
                </span>
              </div>
              <div className='basis-1/3 bg-base-300 flex items-center justify-center h-full'>
                <span className='bg-secondary text-secondary-content border border-secondary-focus w-5 h-5 rounded font-bold'>
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
