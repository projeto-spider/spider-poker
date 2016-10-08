const path = require('path');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const webpack = require('webpack');

const FILENAME = '[name].[chunkhash].js';

module.exports = {
	entry: {
		app: path.join(__dirname, './client/entry.prod.js'),
		vendor: [
			'react',
			'react-dom',
		],
	},
	output: {
		path: path.join(__dirname, './public/build/'),
		publicPath: '/build/',
		filename: FILENAME,
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					compact: false,
				},
			},
		],
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.isClient': JSON.stringify(true),
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity,
			filename: FILENAME,
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
			}
		}),
		new AssetsWebpackPlugin({
			filename: 'webpack.assets.json',
			path: __dirname,
		}),
	],
};
