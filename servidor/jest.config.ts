export default {
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	moduleFileExtensions: ['js', 'json', 'ts'],
	transform: {
		'^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
	},
	testEnvironment: 'node',
};