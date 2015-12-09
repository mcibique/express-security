'use strict';

let fs = require('fs');
let path = require('path');
let extend = require('extend');
let debug = require('debug')('config');

const logger = require('./logger');
const isDev = require('./debug');

const devConfigPath = path.resolve(__dirname, '..', 'config.dev.json');
const defaultConfigPath = '../config.json';
let config;
let defaultConfig = require('../config.json')

if (isDev && fs.existsSync(devConfigPath)) {
  let devConfig = require(devConfigPath);
  config = extend(true, {}, defaultConfig, devConfig);
  debug('using', config);
} else {
  config = defaultConfig;
}

module.exports = config;
