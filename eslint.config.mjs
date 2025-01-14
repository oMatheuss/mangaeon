import reactCompiler from 'eslint-plugin-react-compiler';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      'react-compiler': reactCompiler,
      '@tanstack/query': tanstackQuery,
    },

    rules: {
      'react-compiler/react-compiler': 'error',
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
];

export default config;
