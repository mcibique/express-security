'use strict';

let session = require('express-session');

const config = require('../config.json');

module.exports = session({
  name: 'session',
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: config.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: config.sessionExpiration
  }
});
