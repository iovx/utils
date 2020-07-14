const path = require('path');
const pub = require('./utils/pub-util');
const getPubConfig = require('./getPubConfig');
const { deployPath, outputDir, publicPath } = getPubConfig();

const distPath = deployPath + publicPath;
const packagePath = path.resolve(__dirname, '../' + outputDir);
const copyPattern = packagePath.replace(/\\/g, '/') + '/**';

pub(copyPattern, distPath, 'VOX');