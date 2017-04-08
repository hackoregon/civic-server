'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.pluckShellComponentFromRoutes = pluckShellComponentFromRoutes;
exports.formatPath = formatPath;
exports.mountRoutesToServer = mountRoutesToServer;
exports.default = configureRestifyReactMiddleware;

var _server = require('react-dom/server');

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _sync = require('react-router-redux/lib/sync');

var _sync2 = _interopRequireDefault(_sync);

var _jsonImmutable = require('json-immutable');

var _reactRedux = require('react-redux');

var _configureStore = require('../redux/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _globalAppStatusReducer = require('../redux/globalAppStatusReducer');

var _getPropsFromRoutes2 = require('../utils/getPropsFromRoutes');

var _getPropsFromRoutes3 = _interopRequireDefault(_getPropsFromRoutes2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function pluckShellComponentFromRoutes(routes) {
  var componentToReturn = void 0;

  if (routes.component) {
    componentToReturn = routes.component;
  } else {
    routes.getComponent(null, function (location, component) {
      componentToReturn = component;
    });
  }

  return componentToReturn;
}

function formatPath(basePathString, routePath) {
  return basePathString !== '' ? basePathString + '/' + routePath : routePath;
}

function mountRoutesToServer(restifyApp, appRouter) {
  return function addBasePath() {
    var basePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return function addReactRoute(routeObj) {
      if (routeObj.getChildRoutes) {
        routeObj.getChildRoutes(null, function (err, routesArr) {
          routesArr.forEach(addBasePath(formatPath(basePath, routeObj.path)));
        });
      }

      if (routeObj.childRoutes) {
        routeObj.childRoutes.forEach(addBasePath(formatPath(basePath, routeObj.path)));
      }

      var finalPath = formatPath(basePath, routeObj.path);
      restifyApp.get(finalPath, appRouter);
    };
  };
}

function configureRestifyReactMiddleware(configuration) {
  var storeConfig = configuration.storeConfig,
      getRoutes = configuration.getRoutes,
      renderer = configuration.renderer,
      ssrDisabled = configuration.ssrDisabled,
      NotFoundComponent = configuration.NotFoundComponent;


  function appRouter(req, res, next) {
    var hrefLocation = req.href();
    var memoryHistory = (0, _reactRouter.createMemoryHistory)(hrefLocation);
    var store = (0, _configureStore2.default)(storeConfig);
    var routes = getRoutes(store);
    var history = (0, _sync2.default)(memoryHistory, store);

    var matchProps = { history: history, routes: routes, hrefLocation: hrefLocation };

    function AppliedProvider(props) {
      return _react2.default.createElement(_reactRedux.Provider, _extends({ store: store }, props));
    }

    var internals = {
      sendResponse: function sendResponse(body) {
        var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

        res.charSet('utf-8');
        res.writeHead(status, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Length': Buffer.byteLength(body),
          'X-Powered-By': __DEV__ ? 'Devs Das' : 'Hack Oregon'
        });
        res.write(body);
        res.end();
        next();
      },
      routeHandler: function routeHandler(renderProps) {
        var self = this;

        function rendererPromise() {
          var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _reactRouter.RouterContext;
          var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : renderProps;

          function RootComponent() {
            return _react2.default.createElement(Component, props);
          }

          var reducedStore = {
            getState: store.getState,
            dispatch: store.dispatch
          };

          return renderer(req, { Provider: AppliedProvider, App: RootComponent }, (0, _jsonImmutable.serialize)(store.getState()), _server.renderToString, reducedStore);
        }

        function handleHappyPath(htmls) {
          self.sendResponse(htmls);
        }

        function handleErrorPath(err) {
          if (!err.httpStatus) {
            next(new _restify2.default.errors.InternalServerError(err));
          } else {
            rendererPromise().then(function (htmls) {
              self.sendResponse(htmls, err.httpStatus);
            });
          }
        }

        // 404 handler
        if (!renderProps) {
          store.dispatch(_globalAppStatusReducer.globalActions.updateErrorStatus({
            httpStatus: 404,
            location: hrefLocation,
            message: 'page not found'
          }));

          var AppShell = pluckShellComponentFromRoutes(routes);

          rendererPromise(AppShell, { children: _react2.default.createElement(NotFoundComponent, null) }).then(function (htmls) {
            self.sendResponse(htmls, 404);
          }).catch(handleErrorPath);
          return;
        }

        var _getPropsFromRoutes = (0, _getPropsFromRoutes3.default)(renderProps, ['readyOnActions']),
            readyOnActions = _getPropsFromRoutes.readyOnActions;

        if (ssrDisabled) {
          rendererPromise(function () {
            return null;
          }, {}).then(handleHappyPath).catch(handleErrorPath);
        } else if (!readyOnActions.length) {
          rendererPromise().then(handleHappyPath).catch(handleErrorPath);
        } else {
          var location = renderProps.location,
              params = renderProps.params;

          var unwrappedPromises = [].concat(_toConsumableArray(readyOnActions)).reduce(function (memo, readyOnAction) {
            return memo.concat(readyOnAction(store.dispatch, location, params));
          }, []).map(function (action) {
            return action();
          });

          Promise.all(unwrappedPromises).then(function () {
            return rendererPromise();
          }).then(handleHappyPath).catch(handleErrorPath);
        }
      },
      routerMatchCallback: function routerMatchCallback(error, redirectLocation, renderProps) {
        if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search, next);
        } else if (error) {
          next(new _restify2.default.errors.InternalServerError(error));
        } else if (renderProps || NotFoundComponent) {
          this.routeHandler(renderProps);
        } else if (__DEV__) {
          next(new _restify2.default.errors.NotFoundError('Invalid route: ' + req.href()));
        }
      }
    };

    (0, _reactRouter.match)(matchProps, internals.routerMatchCallback.bind(internals));

    return internals;
  }

  appRouter.handlerName = 'appRouter';
  return appRouter;
}