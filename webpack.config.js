const webpack = require('webpack');
//const here = require('path-here');
module.exports = {
    entry: './src/main',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loaders: ['ng-annotate', 'babel'],
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        'angular': 'angular'
    },
    output: {
        filename: 'dist/dragdropanddrop.js',
        libraryTarget: 'umd',
        library: 'angular-dragdrop'
    },
    resolve: {
        extensions: ['', '.js'] //,
        //alias: {
        //    'angular-fix': here('src/angular-fix')
        //}
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};