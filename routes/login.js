'use strict';

let express = require('express');
let router = express.Router();

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
  // regenerate session because of https://www.owasp.org/index.php/Session_fixation
  req.session.regenerate((err) => {
    if (err) {
      return next(err);
    }
    req.session.user = {
      username,
      lastSignedIn: new Date()
    };
    const returnUrl = getReturnUrlFromQuery(req);
    res.redirect(returnUrl);
  });
});

function getReturnUrlFromQuery(req) {
  const returnUrl = req.query.returnUrl;
  if (returnUrl && returnUrl.indexOf('/') === 0) {
    // allow redirects to local URLs only, avoid redirects to https://localhost:5000/login/?returnUrl=https%3A%2F%2Fwww.google.com%2F or any other suspicious site
    return returnUrl;
  } else {
    return '/';
  }
}

module.exports = router;
