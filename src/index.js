import rule from './rules/prefer-object-spread';

// use commonjs default export so ESLint can find the rule
module.exports = {
	rules: {
		'prefer-object-spread': rule,
	},
	rulesConfig: {
		'prefer-object-spread': 0,
	},
};
