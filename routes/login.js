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
    var returnUrl = req.query.returnUrl;
    console.log('returnUrl', returnUrl);
    if (returnUrl.indexOf('/') === 0) {
      // allow redirects to local URLs only, avoid redirects to https://localhost:5000/login/?returnUrl=https%3A%2F%2Fwww.google.com%2F or any other suspicious site
      res.redirect(returnUrl);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
