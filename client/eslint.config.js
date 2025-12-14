import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJest from 'eslint-plugin-jest'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Jest tests: enable jest globals and basic test rules for test files
  {
    files: [
      'tests/**',
      '**/tests/**',
      'tests/**/*.spec.js',
      'tests/**/*.test.js',
      'tests/**/*.js',
      'tests/**/*.vue',
    ],
    languageOptions: {
      globals: {
        // Common Jest globals
        jest: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    // Keep plugin usage minimal here to avoid flat-config plugin array issues
    plugins: { jest: pluginJest },
    rules: {
      // enable a few useful rules from eslint-plugin-jest by mapping them explicitly
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
])
