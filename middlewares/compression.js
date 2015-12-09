'use strict';

let compression = require('compression');

module.exports = compression({
  threshold: 0
});