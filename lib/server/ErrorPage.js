'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = errorPage;
function errorPage(errData, cb) {
  var isHttpError = !!errData.statusCode;
  var formattedErrorTitle = errData.statusCode + ' ERROR - ' + (errData.restCode || (errData.body || {}).code);
  var formattedErrorMsg = errData.body && (errData.body.message || errData.message);
  var errStack = errData.stack ? errData.stack : errData;
  var jseStack = errData.jse_cause ? errData.jse_cause.stack : null;
  var combinedStacks = [errStack, jseStack].filter(function (stack) {
    return stack !== null;
  }).map(function (stack) {
    return JSON.stringify(stack);
  });

  var finalErrorTitle = isHttpError ? formattedErrorTitle : 'UNCAUGHT EXCEPTION';

  var formatErr = function formatErr(stack) {
    return console.log('%c ' + stack.split('\n').shift(), 'color: red; font-weight: bold;'), console.log(stack.split('\n').slice(1).join('\n')) // eslint-disable-line
    ;
  };

  return cb('\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <meta charset="UTF-8">\n        <title>' + formattedErrorTitle + '</title>\n    </head>\n      <body>\n          <div>\n            <h2 id="title">' + finalErrorTitle + '</h2>\n            <h3>' + formattedErrorMsg + '</h3>\n            <pre style="font-family:monospace;">\n              ' + ('\n' + errData.stack) + '\n              ' + (jseStack ? '\n' + jseStack : null) + '\n            </pre>\n            <a id="cat" style="display: none;" href="http://thecatapi.com">\n              <img style="display: -webkit-inline-box;" src="http://thecatapi.com/api/images/get?format=src&type=gif">\n            </a>\n          </div>\n          <script>\n              var errorStack = [' + combinedStacks + '];\n              var fn = ' + formatErr + ';\n              errorStack.forEach(function(err) {\n                  fn(err);\n              });\n              document.getElementById(\'title\')\n                .onclick = function() {\n                  document.getElementById(\'cat\')\n                    .setAttribute(\'style\', \'display: block;\');\n                  }\n          </script>\n        </body>\n      </html>\n  ');
}