'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureServer;

require('source-map-support/register');

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _configureStore = require('../redux/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _ErrorPage = require('./ErrorPage');

var _ErrorPage2 = _interopRequireDefault(_ErrorPage);

var _identity = require('../utils/identity');

var _identity2 = _interopRequireDefault(_identity);

var _ssrMiddleware = require('./ssrMiddleware');

var _ssrMiddleware2 = _interopRequireDefault(_ssrMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noopLifecycleFns = {
  onServerDidInstantiate: _identity2.default,
  onServerWillMountRoutes: _identity2.default,
  onServerIsListening: _identity2.default
};

function configureServer(_ref) {
  var getRoutes = _ref.getRoutes,
      rootDir = _ref.rootDir,
      renderer = _ref.renderer,
      NotFoundComponent = _ref.NotFoundComponent,
      storeConfig = _ref.storeConfig,
      _ref$port = _ref.port,
      port = _ref$port === undefined ? __DEV__ ? 1337 : 8080 : _ref$port,
      _ref$ssrDisabled = _ref.ssrDisabled,
      ssrDisabled = _ref$ssrDisabled === undefined ? false : _ref$ssrDisabled,
      _ref$appName = _ref.appName,
      appName = _ref$appName === undefined ? 'Civic' : _ref$appName,
      _ref$packageVersion = _ref.packageVersion,
      packageVersion = _ref$packageVersion === undefined ? null : _ref$packageVersion,
      _ref$bunyanConfig = _ref.bunyanConfig,
      bunyanConfig = _ref$bunyanConfig === undefined ? {
    name: appName,
    level: __DEV__ ? 'info' : 'error'
  } : _ref$bunyanConfig;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noopLifecycleFns,
      _ref2$onServerDidInst = _ref2.onServerDidInstantiate,
      onServerDidInstantiate = _ref2$onServerDidInst === undefined ? _identity2.default : _ref2$onServerDidInst,
      _ref2$onServerWillMou = _ref2.onServerWillMountRoutes,
      onServerWillMountRoutes = _ref2$onServerWillMou === undefined ? _identity2.default : _ref2$onServerWillMou,
      _ref2$onServerIsListe = _ref2.onServerIsListening,
      onServerIsListening = _ref2$onServerIsListe === undefined ? _identity2.default : _ref2$onServerIsListe;

  if (!(getRoutes || rootDir || renderer)) {
    throw new Error('ensure your config is configured correctly');
  }

  var server = _restify2.default.createServer({
    log: _bunyan2.default.createLogger(bunyanConfig)
  });

  server.use(_restify2.default.queryParser());

  if (!__DEV__) {
    if (!NotFoundComponent) {
      throw new Error('production applications require a proper 404 page, please include a ' + 'NotFoundComponent in your server\'s configuration');
    }

    server.use(_restify2.default.gzipResponse());
  }

  if (__DEV__) {
    // error handling
    server.on('uncaughtException', function (req, res, next, err) {
      (0, _ErrorPage2.default)(err, function (data) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    });

    // default 400 status error
    server.on('NotFound', function (req, res, err) {
      (0, _ErrorPage2.default)(err, function (data) {
        res.writeHead(err.statusCode, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    });

    // default 500 status error
    server.on('InternalServer', function (req, res, err, cb) {
      (0, _ErrorPage2.default)(err, function (data) {
        res.writeHead(err.statusCode, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
        cb();
      });
    });
  }

  server.pre(function (req, res, next) {
    req.log.info({ req: req.href() }, 'GET');
    next();
  });

  onServerDidInstantiate(server);

  var restifyReactMiddleware = (0, _ssrMiddleware2.default)({
    storeConfig: storeConfig,
    getRoutes: getRoutes,
    renderer: renderer,
    ssrDisabled: ssrDisabled,
    NotFoundComponent: NotFoundComponent
  });

  function startServer() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _identity2.default;

    server.listen(port, function () {
      var finalPackageVersion = packageVersion ? 'v' + packageVersion : '';
      onServerIsListening(server);
      callback(server);
      // eslint-disable-next-line no-console
      console.log(port, appName + ' ' + finalPackageVersion);
    });
  }

  onServerWillMountRoutes(server);

  var initialStateStore = (0, _configureStore2.default)(storeConfig);
  getRoutes(initialStateStore).childRoutes.forEach((0, _ssrMiddleware.mountRoutesToServer)(server, restifyReactMiddleware)());

  return {
    server: server,
    startServer: startServer
  };
}