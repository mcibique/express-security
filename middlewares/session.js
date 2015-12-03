'use strict';

let session = require('express-session');

const config = require('../config.json');

module.exports = session({
  name: config.session.cookieName,
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: config.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: config.session.expiration
  }
});
