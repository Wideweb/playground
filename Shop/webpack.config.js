"use strict"
{
    let path = require('path');
    const webpack = require('webpack');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HTMLWebpackPlugin = require('html-webpack-plugin');
    const ExtractTextPlugin = require("extract-text-webpack-plugin");

    const extractStyles = new ExtractTextPlugin('styles.[chunkhash].css');

    const bundleFolder = "wwwroot";

    module.exports = {
        context: path.resolve(__dirname + '/app'),
        entry: {
            app: './index.js'
        },
        output: {
            filename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, bundleFolder)
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015'],
                        plugins: ["transform-async-to-generator"]
                    }
                },
                {
                    test: /\.(scss|css)$/i,
                    loader: extractStyles.extract(['css-loader', 'sass-loader'])
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([bundleFolder]),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery'
            }),
            new HTMLWebpackPlugin({
                filename: 'index.html',
                template: 'index.html'
            }),
            extractStyles
        ],
        devtool: 'eval-source-map'
    };
}