const message = 'Use a spread property instead of Object.assign().';

function tail(arr) {
	return arr.slice(-1)[0];
}

function createFix(node, sourceCode) {
	function fix(fixer) {
		const args = node.arguments;

		function processArg(n, i) {
			if (n.type === 'ObjectExpression' && n.properties.length === 0) {
				return '';
			}
			const next = args[i + 1] || {};
			const currentArg = `...${sourceCode.getText(n)}`;
			if (next.start) {
				return currentArg + sourceCode.text.slice(n.end, next.start);
			}
			return currentArg;
		}

		const processedArgs = args.map(processArg).join('');
		const lastArg = tail(args);
		const firstArg = args[0];
		const funcEnd = sourceCode
      .text
      .slice(lastArg.end, node.end)
      .split(')')[0];
		const funcStart = tail(sourceCode
      .text
      .slice(node.start, firstArg.start)
      .split('('));
		return fixer.replaceText(node, `({${funcStart}${processedArgs}${funcEnd}})`);
	}

	return fix;
}

export default {
	meta: {
		docs: {
			description: message,
			category: 'Best Practices',
			recommended: false,
		},
		fixable: 'code',
	},
	create(context) {
		const cloneOnly = context.options[0] !== 'always';
		const sourceCode = context.getSourceCode();

		return {
			'CallExpression'(node) {
				const { callee, arguments: args } = node;

				const isObjectAssign = callee.type === 'MemberExpression'
					&& callee.object.name === 'Object'
					&& callee.property.name === 'assign';

				const isCloneOperation = args.length
					&& args[0].type === 'ObjectExpression';

				// Object spread can't be used when passing a spread element to Object.assign()
				// E.g., Object.assign(...a)
				const hasSpreadElement = args.length
					&& args.some(x => x.type === 'SpreadElement');

				if (isObjectAssign && !hasSpreadElement && (isCloneOperation || !cloneOnly)) {
					context.report({ node, message, fix: createFix(node, sourceCode) });
				}
			},
		};
	},
};
