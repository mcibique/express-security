'use strict';

let express = require('express');
let router = express.Router();
const config = require('../helpers/config');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  // https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  res.cookie(config.authentication.cookieName, req.body.username, {
    path: config.authentication.path,
    httpOnly: true,
    secure: true,
    maxAge: config.session.expiration,
    signed: true
  });
  // regenerate session because of https://www.owasp.org/index.php/Session_fixation
  req.session.regenerate(() => {
    req.session.lastSignedIn = new Date();
    res.redirect('/');
  });
});

module.exports = router;
