const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
    watch: true,
    entry: {
        popup: './src/popup.js',
        background: './src/background.js',
        content: './src/content.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules|src\/images/
            }
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name]_bundle.js'
    },
    plugins: [
        // Auto load jquery globals as needed
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CopyWebpackPlugin([
            { from: 'src/manifest.json' },
            { from: 'src/popup.html' },
            { from: 'src/images/*.png', to: 'images', flatten: true }
        ]),
        new ChromeExtensionReloader(),
    ]
}