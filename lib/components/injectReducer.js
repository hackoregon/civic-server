'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = injectReducer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PropTypes = require('react-redux/lib/utils/PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

function injectReducer(reducer) {
  return function wrappedInjectedComponent(WrappedComponent) {
    var InjectedReducerComponent = function (_React$Component) {
      _inherits(InjectedReducerComponent, _React$Component);

      function InjectedReducerComponent(props, context) {
        _classCallCheck(this, InjectedReducerComponent);

        var _this = _possibleConstructorReturn(this, (InjectedReducerComponent.__proto__ || Object.getPrototypeOf(InjectedReducerComponent)).call(this, props));

        _this.store = props.store || context.store;
        _this.store.injectReducer(reducer);
        return _this;
      }

      _createClass(InjectedReducerComponent, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.context));
        }
      }]);

      return InjectedReducerComponent;
    }(_react2.default.Component);

    InjectedReducerComponent.contextTypes = { store: _PropTypes.storeShape };
    InjectedReducerComponent.propTypes = { store: _PropTypes.storeShape };
    InjectedReducerComponent.displayName = 'InjectedReducer(' + getDisplayName(WrappedComponent) + ')';

    return InjectedReducerComponent;
  };
}