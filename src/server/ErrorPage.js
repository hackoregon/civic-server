export default function errorPage(errData, cb) {
  const isHttpError = !!errData.statusCode;
  const formattedErrorTitle = `${errData.statusCode} ERROR - ${errData.restCode || (errData.body || {}).code}`;
  const formattedErrorMsg = errData.body && (errData.body.message || errData.message);
  const errStack = errData.stack ? errData.stack : errData;
  const jseStack = errData.jse_cause ? errData.jse_cause.stack : null;
  const combinedStacks = [errStack, jseStack].filter(stack => stack !== null).map(stack => JSON.stringify(stack));

  const finalErrorTitle = isHttpError
    ? formattedErrorTitle
    : 'UNCAUGHT EXCEPTION';

  const formatErr = stack => (
    (console.log(`%c ${stack.split('\n').shift()}`, 'color: red; font-weight: bold;'), console.log(stack.split('\n').slice(1).join('\n'))) // eslint-disable-line
  );

  return (cb(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
        <title>${formattedErrorTitle}</title>
    </head>
      <body>
          <div>
            <h2 id="title">${finalErrorTitle}</h2>
            <h3>${formattedErrorMsg}</h3>
            <pre style="font-family:monospace;">
              ${`\n${errData.stack}`}
              ${jseStack ? `\n${jseStack}` : null}
            </pre>
            <a id="cat" style="display: none;" href="http://thecatapi.com">
              <img style="display: -webkit-inline-box;" src="http://thecatapi.com/api/images/get?format=src&type=gif">
            </a>
          </div>
          <script>
              var errorStack = [${combinedStacks}];
              var fn = ${formatErr};
              errorStack.forEach(function(err) {
                  fn(err);
              });
              document.getElementById('title')
                .onclick = function() {
                  document.getElementById('cat')
                    .setAttribute('style', 'display: block;');
                  }
          </script>
        </body>
      </html>
  `));
}