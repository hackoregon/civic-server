import configureReducers from './configureReducers';

export default function configureStoreEnhancer({
    defaultReducers = {},
    combineReducers,
} = {
  defaultReducers: {},
}) {
  let asyncReducers = {};

  return function storeEnhancer(next) {
    return function applyInitialState(reducer, initialState, enhancer) {
      const store = next(reducer, initialState, enhancer);
      function injectReducer(reducerToInject) {
        const reducedReducers = Object.keys(reducerToInject).reduce((memo, curr) => {
          if (reducerToInject[curr]) {
            return {
              ...memo,
              [curr]: reducerToInject[curr],
            };
          }
          return memo;
        }, {});
        const asyncReducersToReduce = asyncReducers.merge(reducedReducers);
        asyncReducers = asyncReducersToReduce;
        store.replaceReducer(configureReducers(defaultReducers, asyncReducers, combineReducers));
      }
      function removeInjectedReducer(reducerKey) {
        if (asyncReducers.has(reducerKey)) {
          asyncReducers = asyncReducers.delete(reducerKey);
          store.replaceReducer(configureReducers(defaultReducers, asyncReducers, combineReducers));
        }
      }

      return {
        ...store,
        injectReducer,
        removeInjectedReducer,
      };
    };
  };
}