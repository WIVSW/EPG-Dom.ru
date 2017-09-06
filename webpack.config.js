const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const devServer = require('./webpack/devserver');
const sass = require('./webpack/sass');
const extractCSS = require('./webpack/css.extract');
const uglifyJS = require('./webpack/js.uglify');
const files = require('./webpack/files');


const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build')
};

const common = merge([
	{
		entry: PATHS.src + '/js/index.js',
		output: {
			path: PATHS.build,
			filename: 'js/[name].js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: 'EPG Dom.ru',
				template: PATHS.src + '/main.ejs'
			}),
			new webpack.optimize.CommonsChunkPlugin({
	            name: 'common',
	            minChunks: Infinity
	        })
		]
	},
	files(path)
]);

module.exports = function(env) {
	if (env === 'production') 
		return merge([
			common,
			extractCSS(),
			uglifyJS()
		]);

	if (env === 'development') 
		return merge([
			common,
			devServer(),
			sass()
		]);
}