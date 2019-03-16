module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'@vue/airbnb',
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		indent: [2, 'tab'],
		'no-tabs': 0,
                'yoda': 0,
                'no-plusplus': 0,
                'no-throw-literal': 0,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
