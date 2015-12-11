'use strict';

module.exports = function initLocals(req, res, next) {
  if (req.session) {
    // allow current user being accessible in all views.
    res.locals.user = req.session.user;
    // prefill csrfToken from session (we don't use cookies for CSRF)
    // value is required by each form tag
    res.locals.csrfToken = req.csrfToken();
  }
  next();
};
