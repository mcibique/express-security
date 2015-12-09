'use strict';

const config = require('../helpers/config');

module.exports = function authenticateRequest(req, res, next) {
  // if it's request for /login page allow request to continue.
  if (req.originalUrl.indexOf('/login') === 0) {
    next();
  } else {
    // otherwise check cookie
    let username = req.signedCookies.auth;
    if (!username) {
      // unauthorized request
      res.redirect(303, '/login');
    } else {
      // authorized request, set locals with current username
      res.locals.username = username;
      // touch the cookie
      res.cookie(config.authentication.cookieName, username, {
        path: config.authentication.path,
        httpOnly: true,
        secure: true,
        maxAge: config.authentication.expiration,
        signed: true
      });
      next();
    }
  }
}