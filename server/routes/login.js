import express from 'express';
import { isLocalUrl } from 'helpers/url';
import ms from 'ms';
import { getLimiterFor } from 'helpers/rate-limiters';

let router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(303, '/');
    return;
  }
  let returnUrl = getReturnUrlFromQuery(req);
  // in case that somebody tries to set returnUrl manually to "/login/?returnUrl=http%3A%2F%2Fwhatever.com", reload
  // login with '/' in returnUrl
  if (req.query.returnUrl && returnUrl !== req.query.returnUrl) {
    // using 302 because server rejects to continue.
    res.redirect(302, `/login/?returnUrl=${encodeURIComponent(returnUrl)}`);
    return;
  }
  res.render('login');
});

router.post('/', getUsernameRateLimiter(), (req, res, next) => {
  let username = req.body.username;
  if (!username) {
    return res.render('login', {
      errors: {
        username: 'Please enter user name.'
      }
    });
  }
  // regenerate session because of https://www.owasp.org/index.php/Session_fixation
  req.session.regenerate(function onSessionRegenerated(err) {
    if (err) {
      return next(err);
    }
    req.session.user = {
      username,
      lastSignedIn: new Date()
    };
    let returnUrl = getReturnUrlFromQuery(req);
    res.redirect(303, returnUrl);
  });
});

function getReturnUrlFromQuery(req) {
  let returnUrl = req.query.returnUrl;
  if (returnUrl && isLocalUrl(returnUrl)) {
    // allow redirects to local URLs only, avoid redirects to
    // https://localhost:5000/login/?returnUrl=https%3A%2F%2Fwhatever.com%2F or any other suspicious site
    return returnUrl;
  } else {
    return '/';
  }
}

function getUsernameRateLimiter() {
  // limits maximum 5 requests per 1 minute for the same username.
  let max = 5;
  let duration = ms('1m');
  let keyGenerator = req => req.body.username;
  return getLimiterFor('login-by-username-', max, duration, keyGenerator);
}

export default router;
