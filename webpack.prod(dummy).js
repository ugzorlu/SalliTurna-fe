const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
		assetModuleFilename: 'img/[hash][ext][query]',
		publicPath: '/',
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG: false,
			API_DIRECTORY: '',
			WEB_DIRECTORY: '',
			CLOUDINARY_NAME: '',
			GOOGLEMAPS_API: '',
		}),
	],
});
