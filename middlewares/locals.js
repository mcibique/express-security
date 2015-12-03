'use strict';

module.exports = function initLocals(req, res, next) {
  if (req.session) {
    // fill last signed in information from session
    // value is required by layout.jade
    res.locals.lastSignedIn = req.session.lastSignedIn;
    // prefill csrfToken from session (we don't use cookies for CSRF)
    res.locals.csrfToken = req.csrfToken();
  }
  next();
};
