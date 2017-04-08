'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = clientBootstrapper;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _browserHistory = require('react-router/lib/browserHistory');

var _browserHistory2 = _interopRequireDefault(_browserHistory);

var _sync = require('react-router-redux/lib/sync');

var _sync2 = _interopRequireDefault(_sync);

var _match = require('react-router/lib/match');

var _match2 = _interopRequireDefault(_match);

var _reactRedux = require('react-redux');

var _configureStore = require('../redux/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clientBootstrapper(_ref, callback) {
  var getRoutes = _ref.getRoutes,
      _ref$storeConfig = _ref.storeConfig,
      storeConfig = _ref$storeConfig === undefined ? {} : _ref$storeConfig;

  var store = (0, _configureStore2.default)(storeConfig);
  var history = (0, _sync2.default)(_browserHistory2.default, store, { adjustUrlOnReplay: true });
  var routes = getRoutes(store);

  function AppliedProvider(props) {
    return _react2.default.createElement(_reactRedux.Provider, _extends({ store: store }, props));
  }

  (0, _match2.default)({ history: history, routes: routes }, function (err, redirect, renderProps) {
    callback(err, AppliedProvider, renderProps);
  });
}