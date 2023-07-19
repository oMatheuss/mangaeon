import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
