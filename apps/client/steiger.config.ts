import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['./app/**', './public/**', './out/**', './.next/**', './node_modules/**'],
  },
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
