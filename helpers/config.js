'use strict';

let fs = require('fs');
let extend = require('extend');

const logger = require('./logger');
const isDev = require('./debug');

const devConfigPath = '../config.dev.json';
const defaultConfigPath = '../config.json';
let config;
let defaultConfig = require('../config.json')

if (isDev && fs.existsSync(devConfigPath)) {
  let devConfig = require(devConfigPath);
  config = extend({}, defaultConfig, devConfig);
} else {
  config = defaultConfig;
}

module.exports = config;
