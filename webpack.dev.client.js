const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: [
		`webpack-dev-server/client?http://localhost:8080/`,
		'webpack/hot/only-dev-server',
		path.join(__dirname, './client/entry.dev.js'),
	],
	output: {
		path: path.join(__dirname, './public/scripts/'),
		filename: 'bundle.js',
		publicPath: `http://localhost:8080/`,
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				presets: ['react', 'babel'],
			},
		],
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	devtool: 'source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.isClient': 'true',
		}),
	],
};
