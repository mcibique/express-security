'use strict';

let cookieParser = require('cookie-parser');

const config = require('../helpers/config');

module.exports = cookieParser(config.secret);
