import { IS_DEBUG } from 'config';
import url from 'url';

export function viewLocals(req, res, next) {
  if (req.session) {
    // allow current user being accessible in all views.
    res.locals.user = req.session.user;
    // prefill csrfToken from session (we don't use cookies for CSRF)
    // value is required by each form tag
    res.locals.csrfToken = req.csrfToken();
  }
  // set debug mode
  res.locals.isDebug = IS_DEBUG;
  next();
}

export function assetLocals(req, res, next) {
  // assets fingerprint
  if (res.locals.assetFingerprint) {
    res.locals.asset = path => url.resolve('/assets/', res.locals.assetFingerprint(path));
  } else {
    res.locals.asset = path => path;
  }

  next();
}
