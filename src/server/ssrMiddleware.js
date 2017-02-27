import { renderToString } from 'react-dom/server';
import restify from 'restify';
import React from 'react';
import { RouterContext, match, createMemoryHistory } from 'react-router';
import syncHistoryWithStore from 'react-router-redux/lib/sync';
import { serialize } from 'json-immutable';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import { globalActions } from '../redux/globalAppStatusReducer';
import getPropsFromRoutes from '../utils/getPropsFromRoutes';

export function pluckShellComponentFromRoutes(routes) {
  let componentToReturn;

  if (routes.component) {
    componentToReturn = routes.component;
  } else {
    routes.getComponent(null, (location, component) => {
      componentToReturn = component;
    });
  }

  return componentToReturn;
}

export function formatPath(basePathString, routePath) {
  return basePathString !== ''
    ? `${basePathString}/${routePath}`
    : routePath;
}

export function mountRoutesToServer(restifyApp, appRouter) {
  return function addBasePath(basePath = '') {
    return function addReactRoute(routeObj) {
      if (routeObj.getChildRoutes) {
        routeObj.getChildRoutes(null, (err, routesArr) => {
          routesArr.forEach(addBasePath(
            formatPath(basePath, routeObj.path),
          ));
        });
      }

      if (routeObj.childRoutes) {
        routeObj.childRoutes.forEach(addBasePath(
          formatPath(basePath, routeObj.path),
        ));
      }

      const finalPath = formatPath(basePath, routeObj.path);
      restifyApp.get(finalPath, appRouter);
    };
  };
}

export default function configureRestifyReactMiddleware(configuration) {
  const {
    storeConfig,
    getRoutes,
    renderer,
    ssrDisabled,
    NotFoundComponent,
  } = configuration;

  function appRouter(req, res, next) {
    const hrefLocation = req.href();
    const memoryHistory = createMemoryHistory(hrefLocation);
    const store = configureStore(storeConfig);
    const routes = getRoutes(store);
    const history = syncHistoryWithStore(memoryHistory, store);

    const matchProps = { history, routes, hrefLocation };

    function AppliedProvider(props) {
      return <Provider store={store} {...props} />;
    }

    const internals = {
      sendResponse(body, status = 200) {
        res.charSet('utf-8');
        res.writeHead(status, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Content-Length': Buffer.byteLength(body),
          'X-Powered-By': __DEV__
            ? 'Devs Das'
            : 'Hack Oregon',
        });
        res.write(body);
        res.end();
        next();
      },

      routeHandler(renderProps) {
        const self = this;

        function rendererPromise(Component = RouterContext, props = renderProps) {
          function RootComponent() {
            return (
              <Component {...props} />
            );
          }

          const reducedStore = {
            getState: store.getState,
            dispatch: store.dispatch,
          };

          return renderer(
            req,
            { Provider: AppliedProvider, App: RootComponent },
            serialize(store.getState()),
            renderToString,
            reducedStore,
          );
        }

        function handleHappyPath(htmls) {
          self.sendResponse(htmls);
        }

        function handleErrorPath(err) {
          if (!err.httpStatus) {
            next(new restify.errors.InternalServerError(err));
          } else {
            rendererPromise().then((htmls) => {
              self.sendResponse(htmls, err.httpStatus);
            });
          }
        }

        // 404 handler
        if (!renderProps) {
          store.dispatch(globalActions.updateErrorStatus({
            httpStatus: 404,
            location: hrefLocation,
            message: 'page not found',
          }));

          const AppShell = pluckShellComponentFromRoutes(routes);

          rendererPromise(AppShell, { children: <NotFoundComponent /> })
            .then((htmls) => {
              self.sendResponse(htmls, 404);
            })
            .catch(handleErrorPath);
          return;
        }

        const { readyOnActions } = getPropsFromRoutes(renderProps, ['readyOnActions']);


        if (ssrDisabled) {
          rendererPromise(() => null, {})
            .then(handleHappyPath)
            .catch(handleErrorPath);
        } else if (!readyOnActions.length) {
          rendererPromise()
            .then(handleHappyPath)
            .catch(handleErrorPath);
        } else {
          const { location, params } = renderProps;
          const unwrappedPromises = [...readyOnActions]
            .reduce((memo, readyOnAction) => memo.concat(readyOnAction(store.dispatch, location, params)), [])
            .map(action => action());

          Promise.all(unwrappedPromises)

            .then(() => rendererPromise())
            .then(handleHappyPath)
            .catch(handleErrorPath);
        }
      },

      routerMatchCallback(error, redirectLocation, renderProps) {
        if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search, next);
        } else if (error) {
          next(new restify.errors.InternalServerError(error));
        } else if (renderProps || NotFoundComponent) {
          this.routeHandler(renderProps);
        } else if (__DEV__) {
          next(new restify.errors.NotFoundError(`Invalid route: ${req.href()}`));
        }
      },
    };

    match(matchProps, internals.routerMatchCallback.bind(internals));

    return internals;
  }

  appRouter.handlerName = 'appRouter';
  return appRouter;
}