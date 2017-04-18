import eslint from 'eslint';
import plugin from '../../src';

const rule = plugin.rules['prefer-object-spread'];
const ruleTester = new eslint.RuleTester({
	parserOptions: { ecmaVersion: 8, ecmaFeatures: { experimentalObjectRestSpread: true } },
});

ruleTester.run('prefer-object-spread', rule, {
	valid: [
		'let a = { ...b }',
		'Object.assign()',
		'let a = Object.assign(a, b)',
		'let a = Object.assign(b, { c: 1 })',
		{ code: 'let a = Object.assign(a, b)', options: ['only-clone'] },
		'let a = Object.assign({}, ...b)',
	],
	invalid: [
		{
			code: 'let a = Object.assign({})',
			output: 'let a = ({})',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign({}, a)',
			output: 'let a = ({...a})',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign({ a: 1 }, b)',
			output: 'let a = ({...{ a: 1 }, ...b})',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'let a = Object.assign(a, b)',
			output: 'let a = ({...a, ...b})',
			options: ['always'],
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'Object.assign(a, b)',
			output: '({...a, ...b})',
			options: ['always'],
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'Object.assign(  {},  a,      b,   )',
			output: '({  ...a,      ...b,   })',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'Object.assign({}, a ? b : {}, b => c, a = 2)',
			output: '({...a ? b : {}, ...b => c, ...a = 2})',
			errors: [
				{
					message: 'Use a spread property instead of Object.assign().',
					type: 'CallExpression',
				},
			],
		},
	],
});
