const webpack = require('webpack');
const path = require('path');
const helpers = require('./helpers');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    entry: {
        signup: './src/signup.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [helpers.root('dist'), helpers.root('dist')],
    },
    output: {
        filename: '[name].js',
        path: helpers.root('dist')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            }
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new CleanWebpackPlugin([helpers.root('dist')], {
            root: helpers.root(''),
            verbose: true,
            exclude: []
        })
    ],

};
