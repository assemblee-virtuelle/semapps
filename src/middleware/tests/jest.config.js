/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }]
  },
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

module.exports = config;
