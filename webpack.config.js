const path = require('path');
const webpack = require('webpack');
const isLocalModuleRegex = require('local-module-regex')(process.cwd());
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'bundle.js',
        library: 'webpackTreemap',
        libraryTarget: 'var'
    },

    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.css',
            '.json'
        ]
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: isLocalModuleRegex,
                loader: 'babel-loader'
            },
            {
                test: /\.s?css$/,
                include: isLocalModuleRegex,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                importLoaders: 2,
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                context: './'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            query: {
                                outputStyle: 'expanded',
                                includePaths: 'node_modules'
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.json$/,
                loader: 'json',
                include: isLocalModuleRegex
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [autoprefixer];
                }
            }
        }),
        new ExtractTextPlugin('styles.css')
    ]
};
