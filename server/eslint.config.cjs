// Flat config for ESLint v9+ (server)
// This replaces the previous .eslintrc.json and provides a stable configuration
// that ESLint v9 can load directly.
// Simple flat config for server — avoids `extends` to keep configuration explicit.
module.exports = [
	{
		ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'test-results/**']
	},
	{
		files: ['**/*.ts'],
			languageOptions: {
				parser: require('@typescript-eslint/parser'),
			parserOptions: {
				ecmaVersion: 2024,
				sourceType: 'module',
				project: './tsconfig.json'
			}
		},
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin')
		},
		rules: {
			// keep the project rules from the previous config
			'@typescript-eslint/explicit-module-boundary-types': 'off'
		}
	},
	{
		files: ['**/*.js'],
		languageOptions: { ecmaVersion: 2024, sourceType: 'module' },
		rules: {}
	}
]
