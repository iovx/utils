const resolve = require.resolve;
module.exports = function getBabelConfig() {
  return {
    'comments': true,
    'presets': [
      // '@babel/react',
      [
        // '@babel/env',
        '@babel/preset-env',
        {
          'targets': {
            'ie': '11',
          },
          'modules': 'commonjs',
        },
      ],
      // '@babel/preset-react',
      // '@babel/preset-typescript',
    ],
    'plugins': [
      resolve('@babel/plugin-syntax-dynamic-import'),
      [
        resolve('babel-plugin-import'),
        {
          'libraryName': '@iovx/utils',
          'libraryDirectory': 'es',
          'style': false,
          'camel2DashComponentName': false,
          'customName': name => {
            return `@iovx/utils/es/${[name[0].toLowerCase(), name.substr(1)].join('')}`;
          },
        },
      ],
      [
        resolve('@babel/plugin-transform-runtime'),
        //   {
        //     'helpers': false,
        //     'regenerator': true,
        //     'core-js': 3,
        //     'modules': false,
        //     'useESModules': true,
        //     // 'polyfill': false,
        //     // 'useBuiltIns': 'usage',
        //   },
      ],
      [
        resolve('@babel/plugin-proposal-decorators'),
        {
          'legacy': true,
        },
      ],
      // [
      //   'transform-es2015-modules-commonjs',
      //   {
      //     'allowTopLevelThis': true,
      //   },
      // ],
      resolve('babel-plugin-transform-class-properties'),
    ],
  }
};

