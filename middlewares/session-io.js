'use strict';

let ioSession = require("express-socket.io-session");

let session = require('../middlewares/session');
let cookies = require('../middlewares/cookies')

module.exports = ioSession(session, cookies, {
  autoSave: true
});