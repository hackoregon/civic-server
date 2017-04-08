'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineReducers = undefined;

var _redux = require('redux');

var _configureStore = require('./configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _globalAppStatusReducer = require('./globalAppStatusReducer');

var _globalAppStatusReducer2 = _interopRequireDefault(_globalAppStatusReducer);

var _storeEnhancer = require('./storeEnhancer');

var _storeEnhancer2 = _interopRequireDefault(_storeEnhancer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineReducers = exports.combineReducers = _redux.combineReducers;

exports.default = {
  combineReducers: combineReducers,
  configureStore: _configureStore2.default,
  globalAppStatusReducer: _globalAppStatusReducer2.default,
  globalActions: _globalAppStatusReducer.globalActions,
  storeEnhancer: _storeEnhancer2.default
};