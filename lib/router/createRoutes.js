'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutes;
function createRoutes() {
  for (var _len = arguments.length, routes = Array(_len), _key = 0; _key < _len; _key++) {
    routes[_key] = arguments[_key];
  }

  return function createRoutesWithStore(store) {
    var _ref;

    var finalRoutes = (_ref = []).concat.apply(_ref, routes).map(function (route) {
      if (typeof route === 'function') {
        return route(store);
      }
      return route;
    });

    return finalRoutes;
  };
}