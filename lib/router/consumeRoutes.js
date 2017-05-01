'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = consumeRoutes;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function consumeRoutes(_ref) {
  var childRoutes = _ref.childRoutes,
      component = _ref.component,
      components = _ref.components,
      props = _objectWithoutProperties(_ref, ['childRoutes', 'component', 'components']);

  return function finalConsumeRoutesWithStore(store) {
    var finalRoutes = [].concat(childRoutes).map(function (routeBundle) {
      if (typeof routeBundle === 'function') {
        return routeBundle({
          getState: store.getState,
          dispatch: store.dispatch,
          injectReducer: store.injectReducer
        });
      }
      return routeBundle;
    }).reduce(function (prev, curr) {
      return prev.concat(curr);
    }, []);

    return _extends({
      component: component,
      components: components,
      childRoutes: finalRoutes
    }, props);
  };
}