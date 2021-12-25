const ci = require('miniprogram-ci');
const projectConfig = require('./project.config.json');
const package = require('./package.json');

const ciTag = process.argv.length > 2 ? `ci-${process.argv[2]}` : 'local';

(async () => {
  const project = new ci.Project({
    appid: projectConfig.appid,
    type: 'miniProgram',
    projectPath: projectConfig.miniprogramRoot,
    privateKeyPath: '/tmp/miniapp_key',
  });
  const uploadResult = await ci.upload({
    project,
    version: package.version + '.' + ciTag,
    desc: 'CI build',
    setting: {
      es6: true,
    },
    onProgressUpdate: console.log,
  });
  console.log(uploadResult);
})().catch(e => {
  console.error(e);
  process.exit(-1);
});
