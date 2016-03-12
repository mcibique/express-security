'use strict';

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.render('session', {
    sessionValues: req.session,
    cookieValues: req.cookies,
    signedCookieValues: req.signedCookies
  });
});

module.exports = router;
