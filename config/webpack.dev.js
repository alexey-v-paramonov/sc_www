const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const API_BASE = "http://127.0.0.1:8000/api/v1";

module.exports = function (env) {
    return webpackMerge(commonConfig, {
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'API_BASE': JSON.stringify(API_BASE),
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            }),
        ],
        watch: true
    })
}