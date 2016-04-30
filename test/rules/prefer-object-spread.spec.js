import eslint from 'eslint';
import plugin from '../../src';

const rule = plugin.rules['prefer-object-spread'];
const ruleTester = new eslint.RuleTester({ parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true }}});

ruleTester.run('prefer-object-spread', rule, {
	valid: [
		'let a = { ...b }',
		'Object.assign()',
		'let a = Object.assign(a, b)',
		'let a = Object.assign(b, { c: 1 })',
		{ code: 'let a = Object.assign(a, b)', options: [ 'only-clone' ] },
		'let a = Object.assign({}, ...b)',
	],
	invalid: [
		{
			code: 'let a = Object.assign({})',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign({}, a)',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign({ a: 1 }, b)',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign(a, b)',
			options: [ 'always' ],
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'Object.assign(a, b)',
			options: [ 'always' ],
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
	],
});
