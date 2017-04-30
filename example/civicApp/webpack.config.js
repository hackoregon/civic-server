const { defaultConfig, composeConfig } = require('@hackoregon/webpacker'); // eslint-disable-line
const { resolve } = require('path');
const IsomorphicLoaderPlugin = require('isomorphic-loader/lib/webpack-plugin');

const isomorphicAssetsFile = 'isomorphic-assets.json';

const REAL_ROOT        = process.cwd();
const EXAMPLE_ROOT     = resolve(REAL_ROOT, 'example');
const SRC_PATH         = resolve(EXAMPLE_ROOT, 'civicApp');

const config = {
  context: EXAMPLE_ROOT,
  entry: {
    app: [
      resolve(SRC_PATH, 'client.js'),
    ],
    vendor: [
      'react',
      'react-dom',
      'react-helmet',
      'react-redux',
      'react-router',
    ],
  },
  plugins: [
    new IsomorphicLoaderPlugin({
      keepExistingConfig: false,
      assetsFile: isomorphicAssetsFile,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // exclude: /node_modules/,
        query: {
          presets: [
            'react',
            'stage-1',
          ['es2015', { modules: false }],
          ],
          plugins: [
            'transform-regenerator',
          ],
        },
      }],
  },
};

module.exports = composeConfig(defaultConfig, config);