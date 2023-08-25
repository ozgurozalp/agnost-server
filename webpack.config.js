const webpack = require("webpack");
const path = require("path");

module.exports = {
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist/node"),
		filename: "agnost-server-client.js",
		libraryTarget: "commonjs2",
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /\.js$/,
				loader: "webpack-remove-debug",
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
	},
	mode: "production",
	target: "node",
};
