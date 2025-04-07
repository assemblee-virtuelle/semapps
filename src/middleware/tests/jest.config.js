/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  // testEnvironmentOptions: {
  //   'experimental-vm-modules': true
  // },
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }]
  },
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

module.exports = config;
