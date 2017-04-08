"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.pluckComponentsFromRoute = pluckComponentsFromRoute;
exports.selectPropFromComponent = selectPropFromComponent;
exports.getPropFromRoute = getPropFromRoute;
exports.default = getPropsFromRoute;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function pluckComponentsFromRoute(currentRoute) {
  var componentsToReturn = void 0;

  function reduceComponentsToArray(components) {
    return Object.keys(components).map(function (componentKey) {
      return components[componentKey];
    });
  }

  if (currentRoute.component) {
    componentsToReturn = [currentRoute.component];
  }

  if (currentRoute.getComponent) {
    currentRoute.getComponent(null, function (err, component) {
      componentsToReturn = [component];
    });
  }

  if (currentRoute.components) {
    componentsToReturn = reduceComponentsToArray(currentRoute.components);
  }

  if (currentRoute.getComponents) {
    currentRoute.getComponents(null, function (err, components) {
      componentsToReturn = reduceComponentsToArray(components);
    });
  }

  return componentsToReturn;
}

function selectPropFromComponent(prop) {
  return function getPropFromComponent(component) {
    return component[prop];
  };
}

function getPropFromRoute(routes, prop) {
  return routes.reduce(function (memo, currRoute) {
    var componentsToExtractPropsFrom = pluckComponentsFromRoute(currRoute);
    var routeProps = componentsToExtractPropsFrom.map(selectPropFromComponent(prop)).filter(function (maybeValue) {
      return maybeValue;
    });

    return memo.concat(routeProps);
  }, []);
}

function getPropsFromRoute(renderProps, propsToGet) {
  var finalPropsToGet = [].concat(propsToGet);
  var routes = renderProps.routes;


  return finalPropsToGet.reduce(function (memo, currentProp) {
    return _extends({}, memo, _defineProperty({}, currentProp, getPropFromRoute(routes, currentProp)));
  }, {});
}