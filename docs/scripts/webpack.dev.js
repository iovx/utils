const webpackMerge = require('webpack-merge');
const getWebpackCommonConfig = require('./webpack.common');

const commonWebpackConfig = getWebpackCommonConfig({ mode: 'development', compress: false });
module.exports = webpackMerge(commonWebpackConfig, {
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 7779,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        pathRewrite: { '^/api': '' },
      },
    },
  },
});