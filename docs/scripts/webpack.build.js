const webpackMerge = require('webpack-merge');
const getWebpackCommonConfig = require('./webpack.common');

const commonWebpackConfig = getWebpackCommonConfig({ mode: 'production' });
module.exports = webpackMerge(commonWebpackConfig, {

});