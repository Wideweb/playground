const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const bundleFolder = "wwwroot";
const resourceFolder = path.resolve(`${__dirname}/app/resources`);
const distFolder = path.resolve(`${__dirname}/${bundleFolder}`);

const defaultEnvironment = 'development';
const environment = (process.env.NODE_ENV || defaultEnvironment).toLowerCase();

const DEV = environment === 'development';

const plugins = [
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
    new ExtractTextPlugin('styles.[chunkhash].css'),
    new webpack.EnvironmentPlugin({
        PRODUCTION: !DEV
    }),
    new CopyWebpackPlugin([
        {
            from: `${resourceFolder}/fonts`,
            to: `${distFolder}/fonts`,
        },
    ], {}),
];

if (!DEV) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true, }));
}

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
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: plugins,
    devtool: 'eval-source-map'
};