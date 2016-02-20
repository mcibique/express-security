'use strict';

let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let ms = require('ms');

const config = require('../helpers/config');
const isDebug = require('../helpers/debug');

let store;
if (config.session.redis) {
  store = new RedisStore(config.session.redis);
} else if (isDebug) {
  store = new session.MemoryStore();
} else {
  throw 'Unable to configure session store.';
}

module.exports = session({
  store: store,
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
