const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  plugins: [
    node({
    }),
    commonjs({
      // Temporary fix until https://github.com/improbable-eng/grpc-web/issues/369 is resolved.
      namedExports: {
        '@improbable-eng/grpc-web': [
          "grpc"
        ],
      }
    }),
  ],
};