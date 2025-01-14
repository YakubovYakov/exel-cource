import babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import googleConfig from 'eslint-config-google';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig} */
export default [

	js.configs.recommended,

	googleConfig,

	{
		files: ["**/*.js"],
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				babelOptions: {
					configFile: './babel.config.json',
				},
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {

			'semi': 'off',
			'comma-dangle': 'off',
			'require-jsdoc': 'off',
			'valid-jsdoc': 'off',
		},
	},
];

