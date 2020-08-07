module.exports = (config) => {
  console.log(config.presets[0]);
  config.plugins.push([
    'import',
    {
      'libraryName': '@iovx/utils',
      'libraryDirectory': 'es',
      'style': false,
      'camel2DashComponentName': false,
      'customName': name => {
        return `@iovx/utils/es/${[name[0].toLowerCase(), name.substr(1)].join('')}`;
      },
    },
  ]);
  return config
};
