import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import syncHistoryWithStore from 'react-router-redux/lib/sync';
import match from 'react-router/lib/match';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

export default function clientBootstrapper({ getRoutes, storeConfig = {} }, callback) {
  const store = configureStore(storeConfig);
  const history = syncHistoryWithStore(browserHistory, store, { adjustUrlOnReplay: true });
  const routes = getRoutes(store);

  function AppliedProvider(props) {
    return <Provider store={store} {...props} />;
  }

  match({ history, routes }, (err, redirect, renderProps) => {
    callback(err, AppliedProvider, renderProps);
  });
}