'use strict';

let session = require('express-session');
let ms = require('ms');

const config = require('../helpers/config');

module.exports = session({
  name: config.session.cookieName,
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: config.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: ms(config.session.expiration)
  }
});
