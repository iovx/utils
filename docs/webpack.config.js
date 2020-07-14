const {getProjectPath} = require('./scripts/utils/helper');
const {name: packageName} = require(getProjectPath('package.json'));
console.log('packageName:' + packageName);
module.exports = {
  resolve: {
    extensions: ['js', 'jsx', '.ts', '.tsx', '.js', '.json'],
    alias: {
      '@iovx/utils': getProjectPath('es'),
    },
  },
};
