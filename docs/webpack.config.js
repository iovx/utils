const {getProjectPath} = require('./scripts/utils/helper');
const {name: packageName} = require(getProjectPath('package.json'));
module.exports = {
  resolve: {
    extensions: ['js', 'jsx', '.ts', '.tsx', '.js', '.json'],
    alias: {
      '@iovx/utils': getProjectPath('es'),
    },
  },
};
