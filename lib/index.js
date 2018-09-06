const { join, basename } = require('path');
const { readdirSync, statSync } = require('fs');


function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
  } else if (layer.method) {
    console.log(
      '%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'),
    );
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/');
  } else if (thing.fast_slash) {
    return '';
  }
  const match = thing.toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
  return match
    ? match[1].replace(/\\(.)/g, '$1').split('/')
    : `<complex:${thing.toString()}>`;
}

const isDirectory = source => statSync(source).isDirectory();

function* walkSync(dir, routeMatcher) {
  const files = readdirSync(dir);
  for (const file of files) {
    const pathToFile = join(dir, file);
    if (isDirectory(pathToFile)) {
      yield* walkSync(pathToFile, routeMatcher);
    } else if (pathToFile.includes(routeMatcher)) {
      yield pathToFile;
    } else {
      yield null;
    }
  }
}

class RouteLoader {
  // scan all dirs and find files which ends *.route.js
  init(app) {
    const {
      applicationPath,
      routeMatcher = '.route.js',
    } = app.cache;

    const files = walkSync(applicationPath, routeMatcher);
    for (const currentRoutePath of files) {
      if (currentRoutePath) {
        const fileRouter = require(currentRoutePath)
        const filename = basename(currentRoutePath);
        const arr = filename.split('.');
        arr.splice(-1, 1);
        arr.splice(-1, 1);
        const routeName = arr.join('');
        console.log('routeName', routeName);
        console.log('fileRouter', fileRouter);
        app.use(`/${routeName}`, fileRouter);
      }
    }

    console.log('-------------');
    console.log('Routes start:');
    app._router.stack.forEach(print.bind(null, []));
    console.log('Routes end.');
    console.log('-------------');
  }
}

module.exports = new RouteLoader();
