import createStore from 'redux/lib/createStore';
import applyMiddleware from 'redux/lib/applyMiddleware';
import reduxCompose from 'redux/lib/compose';
import thunk from 'redux-thunk';

import browserHistory from 'react-router/lib/browserHistory';
import routerMiddleware from 'react-router-redux/lib/middleware';

import { deserialize } from 'json-immutable/lib/deserialize';

import installStoreEnhancer from './storeEnhancer';
import globalAppStatusReducer from './globalAppStatusReducer';
import configureReducers from './configureReducers';
import routerReducer from './reactRouterRedux';

const isClient = typeof document !== 'undefined';

const reduxRouterMiddleware = routerMiddleware(browserHistory);
const defaultMiddleware = [thunk, reduxRouterMiddleware];
const defaultReducers = {
  global: globalAppStatusReducer,
  routing: routerReducer,
};

export default function configureStore({
  initialReducers = {},
  middleware = [],
  storeEnhancers = [],
  initialState = isClient ? {} : {},
  combineReducers,
  compose = reduxCompose,
} = {
  initialReducers: {},
  middleware: [],
  storeEnhancers: [],
  initialState: isClient ? {} : {},
}) {
  const finalReducers = {
    ...initialReducers,
    ...defaultReducers,
  };

  const storeEnhancer = installStoreEnhancer({
    combineReducers,
    defaultReducers: finalReducers,
  });

  const finalMiddleware = defaultMiddleware.concat(middleware);
  const finalEnhancers = [storeEnhancer].concat(storeEnhancers);

  const enhancersToCompose = [
    applyMiddleware(...finalMiddleware),
    ...finalEnhancers,
  ].filter(Boolean);

  const finalAppliedMiddleware = compose(...enhancersToCompose);

  let finalInitialState = initialState;
  if (isClient) {
    finalInitialState = deserialize(JSON.stringify(initialState));
  }

  return createStore(
    configureReducers(finalReducers, {}, combineReducers),
    finalInitialState,
    finalAppliedMiddleware,
  );
}
