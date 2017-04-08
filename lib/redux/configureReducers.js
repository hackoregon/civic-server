'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = configureReducers;

var _combineReducers = require('redux/lib/combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureReducers() {
  var defaultReducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var asyncReducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var combineReducers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _combineReducers2.default;

  return combineReducers(_extends({}, defaultReducers, asyncReducers));
}