import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig(
  {
    files: ['src/**/*.ts'],
    ignores: ['dist/**'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      // jsdoc: jsdoc,
    },
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.node,
        ...globals.es2025,
      },
    },
  },
  tseslint.configs.recommendedTypeCheckedOnly,
  { rules: { 'no-useless-assignment': 'off' } }
)
