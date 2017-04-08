'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = configureStore;

var _createStore = require('redux/lib/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _applyMiddleware = require('redux/lib/applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('redux/lib/compose');

var _compose2 = _interopRequireDefault(_compose);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _browserHistory = require('react-router/lib/browserHistory');

var _browserHistory2 = _interopRequireDefault(_browserHistory);

var _middleware = require('react-router-redux/lib/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _deserialize = require('json-immutable/lib/deserialize');

var _storeEnhancer = require('./storeEnhancer');

var _storeEnhancer2 = _interopRequireDefault(_storeEnhancer);

var _globalAppStatusReducer = require('./globalAppStatusReducer');

var _globalAppStatusReducer2 = _interopRequireDefault(_globalAppStatusReducer);

var _configureReducers = require('./configureReducers');

var _configureReducers2 = _interopRequireDefault(_configureReducers);

var _reactRouterRedux = require('./reactRouterRedux');

var _reactRouterRedux2 = _interopRequireDefault(_reactRouterRedux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isClient = typeof document !== 'undefined';

var reduxRouterMiddleware = (0, _middleware2.default)(_browserHistory2.default);
var defaultMiddleware = [_reduxThunk2.default, reduxRouterMiddleware];
var defaultReducers = {
  global: _globalAppStatusReducer2.default,
  routing: _reactRouterRedux2.default
};

function configureStore() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    initialReducers: {},
    middleware: [],
    storeEnhancers: [],
    initialState: isClient ? {} : {}
  },
      _ref$initialReducers = _ref.initialReducers,
      initialReducers = _ref$initialReducers === undefined ? {} : _ref$initialReducers,
      _ref$middleware = _ref.middleware,
      middleware = _ref$middleware === undefined ? [] : _ref$middleware,
      _ref$storeEnhancers = _ref.storeEnhancers,
      storeEnhancers = _ref$storeEnhancers === undefined ? [] : _ref$storeEnhancers,
      _ref$initialState = _ref.initialState,
      initialState = _ref$initialState === undefined ? isClient ? {} : {} : _ref$initialState,
      combineReducers = _ref.combineReducers,
      _ref$compose = _ref.compose,
      compose = _ref$compose === undefined ? _compose2.default : _ref$compose;

  var finalReducers = _extends({}, initialReducers, defaultReducers);

  var storeEnhancer = (0, _storeEnhancer2.default)({
    combineReducers: combineReducers,
    defaultReducers: finalReducers
  });

  var finalMiddleware = defaultMiddleware.concat(middleware);
  var finalEnhancers = [storeEnhancer].concat(storeEnhancers);

  var enhancersToCompose = [_applyMiddleware2.default.apply(undefined, _toConsumableArray(finalMiddleware))].concat(_toConsumableArray(finalEnhancers)).filter(Boolean);

  var finalAppliedMiddleware = compose.apply(undefined, _toConsumableArray(enhancersToCompose));

  var finalInitialState = initialState;
  if (isClient) {
    finalInitialState = (0, _deserialize.deserialize)(JSON.stringify(initialState));
  }

  return (0, _createStore2.default)((0, _configureReducers2.default)(finalReducers, {}, combineReducers), finalInitialState, finalAppliedMiddleware);
}