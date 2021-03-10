const path = require('path');

const webpack = require('webpack');

const WebpackNodeExternals = require('webpack-node-externals');
const ReloadServerPlugin = require('./webpack/ReloadServerPlugin');

const cwd = process.cwd();

const filename = 'api.js';

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    entry: {
        server: [
            './src/index.ts',
        ],
    },
    output: {
        path: path.resolve('build'),
        filename,
    },
    target: 'node',
    node: {
        __dirname: true,
    },
    externals: [
        WebpackNodeExternals({
            allowlist: ['webpack/hot/poll?1000'],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                },
                exclude: [/node_modules/],
            },
        ],
    },
    plugins: [
        new ReloadServerPlugin({
            script: path.resolve('build', filename),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
};