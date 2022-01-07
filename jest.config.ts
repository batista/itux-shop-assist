import type { Config } from '@jest/types';

const jest: Config.InitialOptions = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>ts-automock.config.ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  collectCoverage: true,
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
export default jest;
