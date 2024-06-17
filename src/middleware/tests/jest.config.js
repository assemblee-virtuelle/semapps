/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }]
  },
  transformIgnorePatterns: []
};

module.exports = config;
