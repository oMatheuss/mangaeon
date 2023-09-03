import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['var(--font-comfortaa)', ...fontFamily.sans],
      },
      colors: {
        light: {
          DEFAULT: colors.gray[100],
          b: colors.gray[200],
        },
        dark: {
          DEFAULT: colors.slate[950],
          b: colors.slate[800],
        },
      },
    },
  },
  plugins: [],
};

export default config;
