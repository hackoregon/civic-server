import { combineReducers as ogCombineReducers } from 'redux';
import configureStore from './configureStore';
import globalAppStatusReducer, { globalActions } from './globalAppStatusReducer';
import storeEnhancer from './storeEnhancer';

export const combineReducers = ogCombineReducers;

export default {
  combineReducers,
  configureStore,
  globalAppStatusReducer,
  globalActions,
  storeEnhancer,
};
