const {getProjectPath} = require('@iovx/iv-tool/lib/helper');
const {name: packageName} = require('./package.json');
module.exports = {
  resolve: {
    alias: {
      '@iovx/utils': getProjectPath('es'),
    },
  },
};
