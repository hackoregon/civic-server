import fs from 'fs';

const checkInterval = 200;
const messageInterval = 2000;

let messageTimer = 0;
let messageShownCount = 0;

export function waitForAssets(pathToAssetsDotJson, callback) {
  if (fs.existsSync(pathToAssetsDotJson)) {
    try {
      const jsonFile = JSON.parse(fs.readFileSync(pathToAssetsDotJson).toString());
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
        const errorMessage = 'webpack assets have not been found at the specified location of ' +
          `"${pathToAssetsDotJson}" within the allocated time of 20 seconds. Please ensure your ` +
          'webpack configuration is outputting a valid manifest at the specified location';

        callback(new Error(errorMessage), {});
        return;
      }

      // eslint-disable-next-line no-console
      console.info('waiting for first webpack build to finish...');
    }

    setTimeout(
      () => waitForAssets(pathToAssetsDotJson, callback),
      checkInterval,
    );
  }
}

export default function checkForClient(pathToAssetsDotJson) {
  let resolve;
  let reject;
  const assetsPromise = new Promise((res, rej) => {
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
