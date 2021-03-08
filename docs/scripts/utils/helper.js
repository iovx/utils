const path = require('path');

function resolve(module) {
  return require.resolve(module);
}

function getProjectPath(...args) {
  return path.join(process.cwd(), ...args);
}

module.exports = {
  resolve,
  getProjectPath,
};
