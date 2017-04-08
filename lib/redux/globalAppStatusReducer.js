'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalActions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = globalAppStatusReducer;

var _isClient = require('../utils/isClient');

var _isClient2 = _interopRequireDefault(_isClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var errKey = _isClient2.default ? 'clientError' : 'serverError';

var UPDATE_META_TAGS = 'SERVER/GLOBAL/UPDATE_META_TAGS';
var UPDATE_ERROR_STATUS = 'SERVER/GLOBAL/UPDATE_ERROR_STATUS';

var initialState = {
  metaTags: {},
  hasInitialServerError: false,
  serverError: null,
  clientError: null
};

var updateMetaTags = function updateMetaTags(payload) {
  return function updateMetaTagsThunk(dispatch) {
    return new Promise(function (resolve) {
      dispatch({ type: UPDATE_META_TAGS, payload: payload });
      resolve();
    });
  };
};

var updatePageTitle = function updatePageTitle(title) {
  return updateMetaTags(title);
};

var updateErrorStatus = function updateErrorStatus() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return { type: UPDATE_ERROR_STATUS, payload: payload };
};

var clearErrorStatus = function clearErrorStatus() {
  return updateErrorStatus();
};

function globalAppStatusReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case UPDATE_META_TAGS:
      return _extends({}, state, {
        metaTags: _extends({}, state.metaTags, action.payload)
      });
    case UPDATE_ERROR_STATUS:
      {
        var _extends3;

        if (action.payload) {
          return _extends({}, state, _defineProperty({
            hasInitialServerError: !_isClient2.default
          }, errKey, action.payload));
        }
        return _extends({}, state, (_extends3 = {}, _defineProperty(_extends3, errKey, false), _defineProperty(_extends3, 'hasInitialServerError', false), _extends3));
      }
    default:
      return state;
  }
}

var globalActions = exports.globalActions = {
  updateMetaTags: updateMetaTags,
  updatePageTitle: updatePageTitle,
  updateErrorStatus: updateErrorStatus,
  clearErrorStatus: clearErrorStatus
};