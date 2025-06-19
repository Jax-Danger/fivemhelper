const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		client: './src/client/index.ts',
		server: './src/server/index.ts'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	target: 'node'
};
