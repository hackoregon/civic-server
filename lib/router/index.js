'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _consumeRoutes = require('./consumeRoutes');

var _consumeRoutes2 = _interopRequireDefault(_consumeRoutes);

var _createRoutes = require('./createRoutes');

var _createRoutes2 = _interopRequireDefault(_createRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  consumeRoutes: _consumeRoutes2.default,
  createRoutes: _createRoutes2.default
};