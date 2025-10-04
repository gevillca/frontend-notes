// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettier,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Import sorting with groups (enterprise style but simple)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Node built-ins
            ['^node:'],
            // 2. External packages (Angular first, then others)
            ['^@angular/', '^@?\\w'],
            // 3. Internal packages (your project's aliases)
            ['^@core/', '^@shared/', '^@features/'],
            // 4. Relative imports (parent directories)
            ['^\\.\\.'],
            // 5. Relative imports (same directory)
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      // Only essential TypeScript rules for starting projects
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Warning for new projects
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
