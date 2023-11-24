import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
      },
      fontFamily: {
        sans: ['var(--font-quicksand)', ...fontFamily.sans],
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: true,
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: false,
    rtl: false,
    prefix: '',
    logs: false,
  },
};

export default config;
