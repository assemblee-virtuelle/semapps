/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  // babel-jest
  // extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./jest.setup.ts']
};

export default config;
