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
        comfortaa: ['var(--font-comfortaa)', ...fontFamily.sans],
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: true,
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: '',
    logs: true,
  },
};

export default config;
