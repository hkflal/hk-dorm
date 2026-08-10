import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'src/lib/supabase-services.ts', 'src/components/ui/apple-cards-carousel.tsx'],
  },
  {
    files: ['src/**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-constant-binary-expression': 'error',
      'no-dupe-else-if': 'error',
      'no-unreachable': 'error',
    },
  },
]
