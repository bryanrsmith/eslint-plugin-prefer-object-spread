export default function preferObjectSpreadRule(context) {
	const cloneOnly = context.options[0] !== 'always';

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
				context.report(node, 'Use a spread property instead of Object.assign().');
			}
		},
	};
}
