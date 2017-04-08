const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.ts'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'azt.js',
		library: 'Azt',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	}
};
