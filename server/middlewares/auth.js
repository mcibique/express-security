import { isAjaxRequest } from '../helpers/request';

function allowAnonymousAccess(req) {
  let url = req.originalUrl;
  // allow /login and /logout to be accessible for users without being authenticated
  return url.startsWith('/login') || url.startsWith('/logout');
}

function getCurrentUserName(req) {
  return req.session && req.session.user && req.session.user.username;
}

function getReturnUrl(req) {
  return encodeURIComponent(req.originalUrl || '');
}

export default function authenticateRequest(req, res, next) {
  if (allowAnonymousAccess(req)) {
    return next();
  } else {
    let username = getCurrentUserName(req);
    if (!username) {
      // unauthenticated request
      let returnUrl = getReturnUrl(req);
      if (isAjaxRequest(req)) {
        res.sendStatus(401);
      } else {
        res.redirect(303, `/login/?returnUrl=${returnUrl}`);
      }
    } else {
      // authenticated request, continue
      return next();
    }
  }
}
