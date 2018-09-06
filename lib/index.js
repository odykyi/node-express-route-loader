const { join } = require('path');
const { lstatSync, readdirSync, statSync } = require('fs');

const isDirectory =
  source => lstatSync(source).isDirectory();
const getDirectories =
  source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

function walkSync(dir, routeMatcher) {
  const files = readdirSync(dir);

  for (const file of files) {
    const pathToFile = join(dir, file);
    const isDirectory = statSync(pathToFile).isDirectory();
    return isDirectory
      ? walkSync(pathToFile, routeMatcher)
      : pathToFile.includes(routeMatcher)
        ? pathToFile
        : '';
  }
}

class RouteLoader {
  // scan all dirs and find files which ends *.route.js
  init(app) {
    const {
      applicationPath,
      routeMatcher = '.route.js',
    } = app.cache;
    const oneRouteStr = getDirectories(`${applicationPath}/`).map(x => x.split('/')[x.split('/').length - 1]);
    const allDirs = getDirectories(`${applicationPath}/`);


    const allModules = allDirs.map((oneDir, index) => ({
      routeName: oneRouteStr[index],
      routePath: `${oneDir}/${oneRouteStr[index].substring(0, oneRouteStr[index].length - 1)}${routeMatcher}`,
    }));

    const __files = walkSync(applicationPath);

    allModules.forEach(({ routeName, routePath }) => {
      app.use(`/${routeName}`, require(routePath));
    });
  }
}

module.exports = new RouteLoader();
