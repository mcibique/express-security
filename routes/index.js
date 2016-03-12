'use strict';

let express = require('express');
let router = express.Router();

const isDebug = require('../helpers/debug');

let cache = require('./cache');
let home = require('./home');
let login = require('./login');
let logout = require('./logout');
let session = require('./session');
let user = require('./user');

router.use('/', home);
router.use('/login', login);
router.use('/logout', logout);
router.use('/user', user);

if (isDebug) {
  router.use('/cache', cache);
  router.use('/session', session);
}

module.exports = router;
