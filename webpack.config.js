const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EslintPlugin = require("eslint-webpack-plugin");

module.exports = (env, argv) => {
	const isProd = argv.mode === "production";
	const isDev = !isProd;

	const filename = (ext) =>
		isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`;

	const plugins = () => {
		const base = [
			new HtmlWebpackPlugin({
				template: "./index.html",
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, "src", "favicon.ico"),
						to: path.resolve(__dirname, "dist"),
					},
				],
			}),
			new MiniCssExtractPlugin({
				filename: filename("css"),
			}),
		];
		if (isDev) {
			base.push(
				new EslintPlugin({
					extensions: ["js"],
					exclude: "node_modules",
					emitWarning: true,
				})
			);
		}
		return base;
	};

	return {
		target: "web",
		context: path.resolve(__dirname, "src"),
		entry: {
			main: ["core-js/stable", "regenerator-runtime/runtime", "./index.js"],
		},
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: filename("js"),
			clean: true,
		},
		resolve: {
			extensions: [".js"],
			alias: {
				"@": path.resolve(__dirname, "src"),
				"@core": path.resolve(__dirname, "src", "core"),
			},
		},
		devServer: {
			port: "3006",
			open: true,
			hot: true,
			watchFiles: "./",
		},
		devtool: isDev ? "source-map" : false,
		plugins: plugins(),
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								sourceMap: isDev,
								url: false,
							},
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: isDev,
								sassOptions: {
									quietDeps: true,
								},
							},
						},
					],
				},
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				},
			],
		},
	};
};
