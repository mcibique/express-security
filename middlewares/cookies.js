'use strict';

let cookieParser = require('cookie-parser');

const config = require('../config.json');

module.exports = cookieParser(config.secret);
