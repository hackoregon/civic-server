require('babel-register')({});
const extendRequire = require('isomorphic-loader/lib/extend-require');

require('css-modules-require-hook')({
  generateScopedName: '[path][name]__[local]___[hash:base64:5]',
});

extendRequire({
  startDelay: 1000,
  // processAssets: (assets) => {
  //   const appSrcDir = (settings.getEnv() || settings.build.dir).split('/')[0];
  //   if (appSrcDir !== settings.src.dir && assets.marked) {
  //     const marked = assets.marked;
  //     Object.keys(marked).forEach((k) => {
  //       if (k.startsWith(settings.src.client) || k.startsWith(settings.src.server)) {
  //         const nk = k.replace(settings.src.dir, appSrcDir);
  //         marked[nk] = marked[k];
  //       }
  //     });
  //   }

    // return assets;
  // },
}).then(() => {
  const server = require('../../lib/server/server').default;

  global.__DEV__ = process.env.NODE_ENV !== 'production';

  const config = {
    port: 3000,
    rootDir: require('app-root-dir').get(),
    appName: require('../../package.json').name,
    version: require('../../package.json').version,
    renderer: require('./renderer').default,
    getRoutes: require('./routes').default,
  };

  server(config).startServer();
}).catch((err) => {
  console.log('Error in isomorphic-loader', err); // eslint-disable-line
});

