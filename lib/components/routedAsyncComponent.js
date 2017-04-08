'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = routedAsyncComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isClient = require('../utils/isClient');

var _isClient2 = _interopRequireDefault(_isClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function routedAsyncComponent(asyncActions) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ignoreOnServer = options.ignoreOnServer;


  return function wrapWithAsyncActions(WrappedComponent) {
    if (_isClient2.default || ignoreOnServer) return WrappedComponent;

    return function (_React$Component) {
      _inherits(RoutedAsyncComponent, _React$Component);

      function RoutedAsyncComponent() {
        _classCallCheck(this, RoutedAsyncComponent);

        return _possibleConstructorReturn(this, (RoutedAsyncComponent.__proto__ || Object.getPrototypeOf(RoutedAsyncComponent)).apply(this, arguments));
      }

      _createClass(RoutedAsyncComponent, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state, this.context));
        }
      }], [{
        key: 'readyOnActions',
        value: function readyOnActions() {
          return asyncActions.apply(undefined, arguments);
        }
      }]);

      return RoutedAsyncComponent;
    }(_react2.default.Component);
  };
}