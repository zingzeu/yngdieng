const commonjs = require('@rollup/plugin-commonjs');
const {nodeResolve} = require('@rollup/plugin-node-resolve');

module.exports = {
  plugins: [
    ignoreImport('./../../../google/api/annotations_pb'),
    ignoreImport('./../../../google/api/field_behavior_pb'),
    ignoreImport('./../../../google/api/resource_pb'),
    nodeResolve(),
    commonjs(),
  ],
};

function ignoreImport(idToIgnore) {
  return {
    name: 'yngdieng-ignore-import',
    resolveId(source) {
      if (source === idToIgnore) {
        return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    load(id) {
      if (id === idToIgnore) {
        return ''; // source code of the module, which is empty
      }
      return null; // other ids should be handled as usually
    },
  };
}
