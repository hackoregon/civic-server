import reduxLib from './redux';
import routerLib from './router';
import componentsLib from './components';
import utilsLib from './utils';
import serverLib from './server/server';
import checkForClientLib from './utils/checkForClient';

export { combineReducers } from './redux/index';
export configureStore from './redux/configureStore';

export globalAppStatusReducer from './redux/globalAppStatusReducer';
export { globalActions } from './redux/globalAppStatusReducer';
export storeEnhancer from './redux/storeEnhancer';

export consumeRoutes from './router/consumeRoutes';
export createRoutes from './router/createRoutes';
export { compose } from 'redux';

export routedAsyncConnect from './components/routedAsyncConnect';
export routedAsyncComponent from './components/routedAsyncComponent';
export injectReducer from './components/injectReducer';

export const server = serverLib;
export const checkForClient = checkForClientLib;

export default {
  components: componentsLib,
  redux: reduxLib,
  router: routerLib,
  utils: utilsLib,
  server,
  checkForClient,
};