const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');

const entries = {};
const reg = /routes\/(\w+)/;
glob.sync('./src/routes/**/client.js').forEach(file => {
    const result = file.match(reg);
    const moduleName = result[1];
    entries[moduleName] = [file];
});

const srcPath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');

module.exports = {
    entry: entries,
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, '../dist/assets'),
        publicPath: '/assets',
    },
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(distPath, {
            root: path.resolve(__dirname, '../'),
        }),
        new webpack.DefinePlugin({
            'process.env.BROWSER': true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[chunkhash].css',
            chunkFilename: '[id]-[chunkhash].css',
        }),
        new CopyWebpackPlugin([
            {
                from: srcPath + '/assets/**/*',
                to: distPath + '/assets/',
                flatten: true,
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: srcPath + '/ppt/**/*',
                to: distPath + '/ppt/',
                flatten: true,
            },
        ]),
        new BrotliGzipPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
    resolve: {
        extensions: ['.scss', '.js', '.png', '.svg'],
        modules: ['node_modules'],
        alias: {
            '@img': path.resolve(__dirname, '../src/assets/img/'),
            '@css': path.resolve(__dirname, '../src/assets/css/'),
            '@comp': path.resolve(__dirname, '../src/components/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [srcPath],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-stage-2',
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                include: [srcPath, 'node_modules'],
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                './node_modules/include-media/dist/_include-media.scss',
                                './node_modules/sass-resolution/_resolution.scss',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg|bmp)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        },
                    },
                ],
            },
        ],
    },
};
