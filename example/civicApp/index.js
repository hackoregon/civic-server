require('babel-register')({});

const server = require('../../lib/server/server').default;

global.__DEV__ = process.env.NODE_ENV !== 'production';

const config = {
  port: 3000,
  rootDir: require('app-root-dir').get(),
  appName: require('../../package.json').name,
  version: require('../../package.json').version,
  renderer: require('./renderer').default,
  getRoutes: require('./routes').default,
  NotFoundComponent: require('./pages/NotFound').default,
};

server(config).startServer();
