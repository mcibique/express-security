'use strict';

let ms = require('ms');
let express = require('express');
let router = express.Router();
const config = require('../helpers/config');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  if (!username) {
    return res.render('login', {
      errors: {
        username: 'Please enter user name.'
      }
    });
  }
  // https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  res.cookie(config.authentication.cookieName, username, {
    path: config.authentication.path,
    httpOnly: true,
    secure: true,
    maxAge: ms(config.session.expiration),
    signed: true
  });
  // regenerate session because of https://www.owasp.org/index.php/Session_fixation
  req.session.regenerate(() => {
    req.session.lastSignedIn = new Date();
    var returnUrl = req.query.returnUrl;
    if (returnUrl && returnUrl.indexOf('/') === 0) {
      // allow redirects to local URLs only, avoid redirects to https://localhost:5000/login/?returnUrl=https%3A%2F%2Fwww.google.com%2F or any other suspicious site
      res.redirect(returnUrl);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
