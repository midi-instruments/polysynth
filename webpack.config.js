const { join } = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { version: pkgVersion } = require('./package.json');

const context = __dirname;
const build = join(context, 'dist');
const src = join(context, 'src');
const entry = join(src, 'index.ts');
const static = join(src, 'static');
const template = join(src, 'template.html');

module.exports = async function (env, props) {
    const isProduction = props.mode === 'production';
    const config = {
        mode: props.mode,
        entry,
        output: {
            path: build,
        },
        devServer: {
            hot: false,
            liveReload: false,
            client: false,
            webSocketServer: false,
            static: build,
            server: 'https',
            host: '0.0.0.0',
            compress: false,
            historyApiFallback: { index: '/' },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
        },
        plugins: [
            new ESLintPlugin(),
            new CopyPlugin({
                patterns: [{ from: static, to: './' }],
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(
                    isProduction ? 'production' : process.env.NODE_ENV || 'development',
                ),
                'process.env.VERSION': JSON.stringify(pkgVersion.toString()),
            }),
            new HtmlWebpackPlugin({
                template,
                inject: true,
                filename: './index.html',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { modules: false, targets: 'defaults' }],
                                ['@babel/preset-typescript', { modules: false, targets: 'defaults' }],
                            ],
                        },
                    },
                },
            ],
        },
        devtool: !isProduction && 'source-map',
        resolve: {
            modules: ['node_modules'],
        },
    };
    if (isProduction) {
        config.optimization = {
            minimize: true,
            splitChunks: {
                chunks: 'all',
            },
        };
    }
    if (env.ANALYZE_BUNDLE === 'true') {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
};
