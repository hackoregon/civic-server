import 'source-map-support/register';
import restify from 'restify';
import bunyan from 'bunyan';
import configureStore from '../redux/configureStore';

import ErrorPage from './ErrorPage';
import identity from '../utils/identity';
import configureRestifyReactMiddleware, { mountRoutesToServer } from './ssrMiddleware';

const noopLifecycleFns = {
  onServerDidInstantiate: identity,
  onServerWillMountRoutes: identity,
  onServerIsListening: identity,
};

export default function configureServer({
  getRoutes,
  rootDir,
  renderer,
  NotFoundComponent,
  storeConfig,
  port = __DEV__ ? 1337 : 8080,
  ssrDisabled = false,
  appName = 'Civic',
  packageVersion = null,
  bunyanConfig = {
    name: appName,
    level: __DEV__ ? 'info' : 'error',
  },
}, {
  onServerDidInstantiate = identity,
  onServerWillMountRoutes = identity,
  onServerIsListening = identity,
} = noopLifecycleFns) {
  if (!(getRoutes || rootDir || renderer)) {
    throw new Error('ensure your config is configured correctly');
  }

  const server = restify.createServer({
    log: bunyan.createLogger(bunyanConfig),
  });

  server.use(restify.queryParser());

  if (!__DEV__) {
    if (!NotFoundComponent) {
      throw new Error(
        'production applications require a proper 404 page, please include a ' +
        'NotFoundComponent in your server\'s configuration',
      );
    }

    server.use(restify.gzipResponse());
  }

  if (__DEV__) {
    // error handling
    server.on('uncaughtException', (req, res, next, err) => {
      ErrorPage(err, (data) => {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    });

    // default 400 status error
    server.on('NotFound', (req, res, err) => {
      ErrorPage(err, (data) => {
        res.writeHead(err.statusCode, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    });

    // default 500 status error
    server.on('InternalServer', (req, res, err, cb) => {
      ErrorPage(err, (data) => {
        res.writeHead(err.statusCode, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
        cb();
      });
    });
  }

  server.pre((req, res, next) => {
    req.log.info({ req: req.href() }, 'GET');
    next();
  });

  onServerDidInstantiate(server);

  const restifyReactMiddleware = configureRestifyReactMiddleware({
    storeConfig,
    getRoutes,
    renderer,
    ssrDisabled,
    NotFoundComponent,
  });

  function startServer(callback = identity) {
    server.listen(port, () => {
      const finalPackageVersion = packageVersion ? `v${packageVersion}` : '';
      onServerIsListening(server);
      callback(server);
      // eslint-disable-next-line no-console
      console.log(port, `${appName} ${finalPackageVersion}`);
    });
  }

  onServerWillMountRoutes(server);

  const initialStateStore = configureStore(storeConfig);
  getRoutes(initialStateStore)
    .childRoutes.forEach(mountRoutesToServer(server, restifyReactMiddleware)());

  return {
    server,
    startServer,
  };
}