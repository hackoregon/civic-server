'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = configureStoreEnhancer;

var _configureReducers = require('./configureReducers');

var _configureReducers2 = _interopRequireDefault(_configureReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function configureStoreEnhancer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    defaultReducers: {}
  },
      _ref$defaultReducers = _ref.defaultReducers,
      defaultReducers = _ref$defaultReducers === undefined ? {} : _ref$defaultReducers,
      combineReducers = _ref.combineReducers;

  var asyncReducers = {};

  return function storeEnhancer(next) {
    return function applyInitialState(reducer, initialState, enhancer) {
      var store = next(reducer, initialState, enhancer);
      function injectReducer(reducerToInject) {
        var reducedReducers = Object.keys(reducerToInject).reduce(function (memo, curr) {
          if (reducerToInject[curr]) {
            return _extends({}, memo, _defineProperty({}, curr, reducerToInject[curr]));
          }
          return memo;
        }, {});
        var asyncReducersToReduce = asyncReducers.merge(reducedReducers);
        asyncReducers = asyncReducersToReduce;
        store.replaceReducer((0, _configureReducers2.default)(defaultReducers, asyncReducers, combineReducers));
      }
      function removeInjectedReducer(reducerKey) {
        if (asyncReducers.has(reducerKey)) {
          asyncReducers = asyncReducers.delete(reducerKey);
          store.replaceReducer((0, _configureReducers2.default)(defaultReducers, asyncReducers, combineReducers));
        }
      }

      return _extends({}, store, {
        injectReducer: injectReducer,
        removeInjectedReducer: removeInjectedReducer
      });
    };
  };
}