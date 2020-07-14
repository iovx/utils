const path = require('path');
const { getProjectPath } = require('./utils/helper');
const { toCamel, uppercaseFirst } = require('./utils/word');


const pubConfig = require('./pub.json');
const publicPath = pubConfig.publicPath;
const deployPath = pubConfig.deployPath;
const outputDir = pubConfig.output;
const demoPath = pubConfig.demoPath;

const pkgInfoPath = getProjectPath('package.json');
const rootPath = path.resolve(__dirname, '../');
const srcPath = rootPath + '/' + demoPath;

const pkgInfo = require(pkgInfoPath);
const name = pkgInfo.name;

module.exports = function() {
  return {
    packageName: name,
    libraryName: uppercaseFirst((toCamel(name))),
    srcPath,
    rootPath,
    publicPath,
    outputDir,
    demoPath,
    deployPath,
  };
};