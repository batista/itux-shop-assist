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
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.{test,d}.ts'],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
export default jest;
