export default {
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
	},
	testEnvironment: 'node',
};