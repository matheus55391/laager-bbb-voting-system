/* eslint-disable */
export default {
    displayName: '@laager-bbb-voting-system/aggregate-service-e2e',
    preset: '../../../../jest.preset.js',
    globalSetup: '<rootDir>/src/support/global-setup.ts',
    globalTeardown: '<rootDir>/src/support/global-teardown.ts',
    setupFiles: ['<rootDir>/src/support/test-setup.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': [
            '@swc/jest',
            {
                jsc: {
                    parser: { syntax: 'typescript', decorators: true },
                    transform: { decoratorMetadata: true },
                    target: 'es2022',
                },
            },
        ],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: 'test-output/jest/coverage',
};
