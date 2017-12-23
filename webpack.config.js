const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        path.join(__dirname, '/src/index.js')
    ],
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/manifest.json'},
            { from: 'src/index.html'},
            { from: 'src/background.js' },
            { from: 'src/contentScript.js'},
            { from: 'src/images/*', to: 'images', flatten: true},
        ], {
                ignore: [
                ],

                // By default, we only copy modified files during
                // a watch or webpack-dev-server build. Setting this
                // to `true` copies all files.
                copyUnmodified: true
            })
    ]
}