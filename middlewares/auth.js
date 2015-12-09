'use strict';

let ms = require('ms');

const config = require('../helpers/config');

module.exports = function authenticateRequest(req, res, next) {
  // if it's request for /login page or /logout then allow request to continue.
  if (req.originalUrl.indexOf('/login') === 0 || req.originalUrl.indexOf('/logout') === 0) {
    next();
  } else {
    // otherwise check cookie
    let username = req.signedCookies[config.authentication.cookieName];
    if (!username) {
      // unauthorized request
      // build redirect URL:
      const returnUrl = encodeURIComponent(req.originalUrl);
      res.redirect(303, `/login/?returnUrl=${returnUrl}`);
    } else {
      // authorized request, set locals with current username
      res.locals.username = username;
      // touch the cookie
      res.cookie(config.authentication.cookieName, username, {
        path: config.authentication.path,
        httpOnly: true,
        secure: true,
        maxAge: ms(config.authentication.expiration),
        signed: true
      });
      next();
    }
  }
}