'use strict';

const isDebug = require('../helpers/debug');

let url = require('url');

module.exports = function initLocals(req, res, next) {
  if (req.session) {
    // allow current user being accessible in all views.
    res.locals.user = req.session.user;
    // prefill csrfToken from session (we don't use cookies for CSRF)
    // value is required by each form tag
    res.locals.csrfToken = req.csrfToken();
  }
  // set debug mode
  res.locals.isDebug = isDebug;
  // assets fingerprint
  if (res.locals.assetFingerprint) {
    res.locals.asset = path => url.resolve('/assets/', res.locals.assetFingerprint(path));
  } else {
    res.locals.asset = path => path;
  }
  next();
};
