var express = require('express');
var router = express.Router();

/* GET user's profile. */
router.get('/', function(req, res, next) {
  res.render('user', {
    sessionValues: req.session,
    cookieValues: req.cookies,
    signedCookieValues: req.signedCookies
  });
});

module.exports = router;
