var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  res.cookie('auth', req.body.username, {
    path: '/',
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
    signed: true
  });
  req.session.regenerate(function () {
    req.session.lastSignedIn = new Date();
    res.redirect('/');
  });
});

module.exports = router;
