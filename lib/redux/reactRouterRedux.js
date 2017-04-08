'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reactRouterRedux;

var _reducer = require('react-router-redux/lib/reducer');

var initialState = {
  locationBeforeTransitions: null
};

function reactRouterRedux() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  return action.type === _reducer.LOCATION_CHANGE ? _extends({}, state, {
    locationBeforeTransitions: _extends({}, action.payload, {
      query: _extends({}, action.payload.query)
    })
  }) : state;
}