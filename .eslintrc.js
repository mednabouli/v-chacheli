module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/recommended'
	],

	// required to lint *.vue files
	plugins: [
		'vue'
	],
	// add your custom rules here
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-mixed-spaces-and-tabs': [ 'warn', 'smart-tabs' ],

		'vue/html-indent': ['warn', 'tab', {
			'attribute': 1,
			'closeBracket': 0,
			'alignAttributesVertically': true,
			'ignores': []
		}],

		'vue/max-attributes-per-line': 0,
		'vue/attributes-order': 0,
		'vue/html-self-closing': 0,
		'vue/name-property-casing': 0,
		'vue/require-prop-types': 0, // FIXME: enable
	}
}
