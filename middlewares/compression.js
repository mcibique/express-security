'use strict';

let compression = require('compression');

const config = require('../helpers/config');

module.exports = compression({
  threshold: config.compression.threshold
});
