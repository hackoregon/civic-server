'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForAssets = waitForAssets;
exports.default = checkForClient;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkInterval = 200;
var messageInterval = 2000;

var messageTimer = 0;
var messageShownCount = 0;

function waitForAssets(pathToAssetsDotJson, callback) {
  if (_fs2.default.existsSync(pathToAssetsDotJson)) {
    try {
      var jsonFile = JSON.parse(_fs2.default.readFileSync(pathToAssetsDotJson).toString());
      callback(null, jsonFile);
    } catch (err) {
      callback(err);
    }
  } else {
    messageTimer += checkInterval;
    if (messageTimer >= messageInterval) {
      messageTimer = 0;
      messageShownCount += 1;
      if (messageShownCount >= 10) {
        var errorMessage = 'webpack assets have not been found at the specified location of ' + ('"' + pathToAssetsDotJson + '" within the allocated time of 20 seconds. Please ensure your ') + 'webpack configuration is outputting a valid manifest at the specified location';

        callback(new Error(errorMessage), {});
        return;
      }

      // eslint-disable-next-line no-console
      console.info('waiting for first webpack build to finish...');
    }

    setTimeout(function () {
      return waitForAssets(pathToAssetsDotJson, callback);
    }, checkInterval);
  }
}

function checkForClient(pathToAssetsDotJson) {
  var resolve = void 0;
  var reject = void 0;
  var assetsPromise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });

  function assetsCallback(err, jsonData) {
    if (err) {
      reject(err);
    } else {
      resolve(jsonData);
    }
  }

  waitForAssets(pathToAssetsDotJson, assetsCallback);

  return assetsPromise;
}