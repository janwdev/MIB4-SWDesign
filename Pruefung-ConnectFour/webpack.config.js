const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    // target: 'web',
    target: 'node',
    externals: [nodeExternals()], // removes node_modules from your final bundle
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bundle'),
    },
    // optimization: {
    //     minimize: false, // enabling this reduces file size and readability
    // },
};