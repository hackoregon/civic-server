'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routedAsyncComponent = require('./routedAsyncComponent');

var _routedAsyncComponent2 = _interopRequireDefault(_routedAsyncComponent);

var _routedAsyncConnect = require('./routedAsyncConnect');

var _routedAsyncConnect2 = _interopRequireDefault(_routedAsyncConnect);

var _injectReducer = require('./injectReducer');

var _injectReducer2 = _interopRequireDefault(_injectReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  routedAsyncComponent: _routedAsyncComponent2.default,
  routedAsyncConnect: _routedAsyncConnect2.default,
  injectReducer: _injectReducer2.default
};