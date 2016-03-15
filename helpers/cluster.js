'use strict';

let os = require('os');

const config = require('../helpers/config');
const isDebug = require('../helpers/debug');

let useCluster = false;
if (config.cluster === 'auto' && !isDebug) {
  useCluster = os.cpus().length;
} else if (config.cluster === true) {
  useCluster = os.cpus().length;
} else if (typeof config.cluster === 'number' && config.cluster > 0) {
  useCluster = Math.floor(config.cluster);
}

module.exports = useCluster;