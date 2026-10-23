import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import globals from 'globals'

export default defineConfigWithVueTs(
  {
    ignores: ['public/**', 'vendor/**', 'node_modules/**', 'build/**', 'src/components.d.ts'],
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'no-console': ['error', { allow: ['debug', 'warn', 'error'] }],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.js'],
    extends: [vueTsConfigs.disableTypeChecked],
  },
)
