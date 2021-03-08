const webpackMerge = require('webpack-merge');
const getWebpackCommonConfig = require('./webpack.common');
const { rootPath, packageName, libraryName } = require('./getPubConfig')();
const commonWebpackConfig = getWebpackCommonConfig({
  mode: 'development',
  compress: false,
  lib: true,
});
const config = webpackMerge(commonWebpackConfig, {
  entry: rootPath + '/src/index.ts',
  output: {
    filename: packageName + '.umd.js',
    path: rootPath + '/lib',
    publicPath: '/',
    // libraryExport: "default",
    libraryTarget: 'umd',
    // library: libraryName,
  },
});

module.exports = config;