var fs = require('fs');
var nconf = require('nconf');
const _ = require('lodash');

nconf.env().use('memory');

var env = nconf.get('NODE_ENV');
if (!env) {
  nconf.set('NODE_ENV', 'development');
  env = nconf.get('NODE_ENV');
}

var envBasePath = `${__dirname}/${env}/base.js`;
var globalBasePath = `${__dirname}/base.js`;
let config = require(globalBasePath);

const isFileReadable = (path) => {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
};

if (isFileReadable(envBasePath)) {
  const envBseConfig = require(envBasePath);
  config = _.defaultsDeep(envBseConfig, config);
} else {
  throw new Error(`Unknown ${env} environment.`); // ENV base config must be placed
}

Object.keys(config).forEach((key) => {
  nconf.set(key, config[key]);
});

module.exports = nconf;
