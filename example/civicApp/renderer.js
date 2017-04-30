import React from 'react';
import path from 'path';
import { rewind } from 'react-helmet';
import checkForClient from '../../lib/utils/checkForClient';

function htmlShell(serializedStore, innerHtml, { vendor, app }) {
  const head = rewind();

  const javascripts = `
    <script src="${vendor.js}"></script>
    <script src="${app.js}"></script>
  `;

  const headInnerHtml = `
    ${head.title ? head.title.toString() : ''}
    ${head.meta ? head.meta.toString() : ''}
    ${head.link ? head.link.toString() : ''}
    <script id="initial-state">window.INITIAL_REDUX_STATE=${serializedStore}</script>
  `;

  return (`
    <!doctype html>
    <html>
      <head>${headInnerHtml}</head>
      <link rel="stylesheet" href="${app.css}" />
      <body>
        <div id="react-root">
          <div>${innerHtml}</div>
        </div>
        ${javascripts}
      </body>
    </html>
  `);
}

export default function reactRenderer(req, { Provider, App }, serializedStore, renderToString) {
  return checkForClient(path.resolve('./build', 'webpack-assets.json'))
    .then((assets) => {
      try {
        const innerHtml = renderToString(
          <Provider>
            <App />
          </Provider>,
        );

        return Promise.resolve(
          htmlShell(serializedStore, innerHtml, assets),
        );
      } catch (e) {
        return Promise.reject(e);
      }
    });
}