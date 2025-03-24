import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  {
    vue: true,
    unocss: true,
    ignores: ['public/']
  },
  {
    rules: {
      'no-console': 'off',
      'consistent-return': 'off', // 关闭这个规则
      '@typescript-eslint/no-shadow': 'off',
      'vue/no-static-inline-styles': 'off',
      'vue/multi-word-component-names': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'n/handle-callback-err': 'off',
      'guard-for-in': 'off',
      'func-names': 'off',
      'array-callback-return': 'off',
      eqeqeq: 'off',
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', '[id]']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/']
        }
      ],
      'vue/html-comment-content-newline': ['error', { singleline: 'ignore', multiline: 'ignore' }],
      'order-attributify': 'off'
    }
  }
);
