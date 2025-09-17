module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', '@vue/eslint-config-prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: require.resolve('espree'),
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: require.resolve('espree'),
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    }
  ],
  plugins: ['vue'],
  rules: {
    // Vue相关规则
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'warn',
    'vue/no-v-model-argument': 'off',

    // JavaScript通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'error',

    // 代码风格
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never']
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
