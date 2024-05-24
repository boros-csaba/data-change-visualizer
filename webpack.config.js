const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '/',
        clean: true
    },

    resolve: {
        alias: {
          '@scripts': path.join(__dirname, 'src/scripts'),
          '@styles': path.join(__dirname, 'src/styles'),
          '@assets': path.join(__dirname, 'src/assets'),
          '@root': path.join(__dirname, 'src/'),
        },
      },

    entry: {
        // define HTML files here
        index: './src/index.html',
        download: './src/download.html',
        // ...
    },

    plugins: [
        new HtmlBundlerPlugin({
            js: {
                filename: 'assets/js/[name].[contenthash:8].js',
            },
            css: {
                filename: 'assets/css/[name].[contenthash:8].css',
            },
        }),
    ],

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|ico)/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[name].[hash:8][ext]',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.xlsx$/,
                type: 'asset/resource',
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
            },
        ],
    },
};
