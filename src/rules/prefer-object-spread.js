export default function preferObjectSpreadRule(context) {
	let cloneOnly = context.options[0] !== 'always';

	return {
		'CallExpression'(node) {
			let { callee, arguments: args } = node;

			let isObjectAssign = callee.type === 'MemberExpression'
				&& callee.object.name === 'Object'
				&& callee.property.name === 'assign';

			let isCloneOperation = args.length
				&& args[0].type === 'ObjectExpression';

			if (isObjectAssign && (isCloneOperation || !cloneOnly)) {
				context.report(node, 'Use a spread property instead of Object.assign().');
			}
		},
	};
}
