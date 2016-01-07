'use strict';

let express = require('express');
let router = express.Router();
let urls = require('../helpers/url');

router.get('/', function(req, res, next) {
  const returnUrl = getReturnUrlFromQuery(req);
  // in case that somebody tries to set returnUrl manually to "/login/?returnUrl=http%3A%2F%2Fwhatever.com", reload login with '/' in returnUrl
  if (req.query.returnUrl && returnUrl !== req.query.returnUrl) {
    // using 302 because server rejects to continue.
    return res.redirect(302, `/login/?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
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
    res.redirect(303, returnUrl);
  });
});

function getReturnUrlFromQuery(req) {
  const returnUrl = req.query.returnUrl;
  if (returnUrl && urls.isLocalUrl(returnUrl)) {
    // allow redirects to local URLs only, avoid redirects to https://localhost:5000/login/?returnUrl=https%3A%2F%2Fwhatever.com%2F or any other suspicious site
    return returnUrl;
  } else {
    return '/';
  }
}

module.exports = router;
