/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { createDefaultEsmPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} * */
const config = {
  // ts-node
  // testEnvironment: 'node',
  // transform: {
  //   ...tsJestTransformCfg
  // },

  // babel-jest
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [],

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: '70%',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./jest.setup.ts']
};

export default config;
