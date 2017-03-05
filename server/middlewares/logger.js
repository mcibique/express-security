'use strict';

let morgan = require('morgan');
let logger = require('../helpers/logger');

const isDev = require('../helpers/debug');

let stream = {
  write(message /* , encoding */) {
    logger.info(message.slice(0, -1));
  }
};

module.exports = morgan(isDev ? 'common' : 'combined', { stream });
