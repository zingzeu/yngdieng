module.exports = {
  stories: ['../stories/**/*.stories.mdx', '@yngdieng-web-app/**/*.stories.js'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, options) => {
    // console.log(process.env);
    // config.resolve.alias['@yngdieng-web-app']=path.resolve(__dirname,"../../../../../../../../../../node_modules/@yngdieng-web-app");
    config.resolve.extensions = ['.js', '.json'];
    //config.resolve.modules.push(path.resolve(__dirname,"../../../../"));
    // config.node = {
    // global: true,
    //__dirname: false
    //};
    config.module.rules.push({
      test: /@yngdieng-web-app\/.*\.js$/,
      use: ['umd-compat-loader'], //umdCompatLoader
    });
    console.log(config.module);
    return config;
  },
};
