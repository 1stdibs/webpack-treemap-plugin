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
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        'css-loader',
                        'sass-loader',
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.json$/,
                loader: 'json'
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
