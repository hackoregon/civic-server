'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routedAsyncConnect;

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _routedAsyncComponent = require('./routedAsyncComponent');

var _routedAsyncComponent2 = _interopRequireDefault(_routedAsyncComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routedAsyncConnect(asyncActions) {
  for (var _len = arguments.length, connectProps = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    connectProps[_key - 1] = arguments[_key];
  }

  return (0, _redux.compose)((0, _routedAsyncComponent2.default)(asyncActions), _reactRedux.connect.apply(undefined, connectProps));
}