/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['esbuild-jest', { rootMode: 'upward' }]
  },
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

module.exports = config;
