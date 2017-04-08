'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _getPropsFromRoutes = require('./getPropsFromRoutes');

var _getPropsFromRoutes2 = _interopRequireDefault(_getPropsFromRoutes);

var _clientBootstrapper = require('./clientBootstrapper');

var _clientBootstrapper2 = _interopRequireDefault(_clientBootstrapper);

var _identity = require('./identity');

var _identity2 = _interopRequireDefault(_identity);

var _isClient = require('./isClient');

var _isClient2 = _interopRequireDefault(_isClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  compose: _redux.compose,
  isClient: _isClient2.default,
  identity: _identity2.default,
  clientBootstrapper: _clientBootstrapper2.default,
  getPropsFromRoutes: _getPropsFromRoutes2.default
};