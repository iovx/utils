const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniExtract = require('mini-css-extract-plugin');
const getPubConfig = require('./getPubConfig');
const {getProjectPath, resolve} = require('./utils/helper');
const getBabelConfig = require('./babel.config');
const {srcPath, packageName, publicPath: deployPublicPath, outputDir, rootPath} = getPubConfig();

module.exports = function (options) {
  const MiniExtractLoader = {
    loader: MiniExtract.loader,
    options: {
      publicPath: '/',
      hmr: false,
    },
  };
  const {mode, lib, compress, noHtml, cssAtRoot} = {
    compress: true,
    mode: 'production',
    lib: false,
    ...options,
  };
  const publicPath = mode === 'production' ? deployPublicPath : '/';
  return {
    entry: srcPath + '/index.ts',
    output: {
      filename: 'static/js/bundle.js',
      path: rootPath + '/' + outputDir,
      publicPath: publicPath,
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['js', 'jsx', '.ts', '.tsx', '.js', '.json'],
      alias: {
        [packageName]: getProjectPath('es'),
      },
    },
    mode,
    optimization: {
      minimize: compress,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...getBabelConfig(),
              }
            }, 'awesome-typescript-loader'],
          exclude: /(node-modules|bower-components)/,
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...getBabelConfig(),
              }
            }
          ],
          // exclude: /(node-modules|bower-components)/,
        },
        {test: /\.txt/, use: ['raw-loader']},
        {
          test: /\.json$/,
          type: 'javascript/auto',
          loader: 'json-loader',
        },
        {
          test: /\.css$/,
          use: [
            MiniExtractLoader,
            {
              loader: resolve('css-loader'),
              options: {
                modules: false,
              },
            },
            {
              loader: resolve('postcss-loader'),
              options: {
                plugins: () => [
                  require('autoprefixer')(),
                ],
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniExtractLoader,
            {
              loader: resolve('css-loader'),
              options: {
                modules: false,
              },
            },
            {
              loader: resolve('postcss-loader'),
              options: {
                plugins: () => [
                  require('autoprefixer')(),
                ],
              },
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniExtractLoader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
            {
              loader: 'sass-loader',
            }],
        },
        {
          test: /\.styl$/,
          use: [
            MiniExtractLoader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            }, {
              loader: 'stylus-loader',
            }],
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-sprite-loader',
            options: {},
          },
        },
        {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
      ],
    },
    externals: {
      jquery: '$',
      less: 'less',
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: `${mode}`,
        },
      }),
    ].concat([
      [!lib && !noHtml, new HtmlWebpackPlugin({
        filename: 'index.html',
        template: srcPath + '/index.html',
        title: packageName,
      })],
      [!lib, new CleanWebpackPlugin({
        verbose: false,
        dry: false,
      })],
      [!lib, new CopyWebpackPlugin([
        {
          from: getProjectPath('readme.md'),
          to: getProjectPath(outputDir),
          ignore: ['.*'],
        },
      ])],
      [!lib, new MiniExtract({
        filename: cssAtRoot ? '[name].css' : 'static/css/[name].css',
      })],
      [!lib, new webpack.optimize.MinChunkSizePlugin({minChunkSize: 800})],
      [!lib && mode === 'development', new webpack.HotModuleReplacementPlugin()],
    ].filter(([flag]) => flag).map(([flag, plugin]) => plugin)),
  };
};
