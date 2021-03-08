const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.dev');

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler);

server.listen(7772, () => {
  console.log('Server is running at 7772 !!!');
});

