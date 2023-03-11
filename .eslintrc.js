/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: ['plugin:json/recommended'],
  plugins: ['check-file'],
  rules: {
    'check-file/filename-blocklist': [
      'error',
      {
        '{,}package-lock.json': '*pnpm-lock.yaml',
      },
    ],
  },
};
