'use strict';

let express = require('express');
let router = express.Router();
let config = require('../config.json');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  res.cookie('auth', req.body.username, {
    path: '/',
    httpOnly: true,
    secure: true,
    maxAge: config.sessionExpiration,
    signed: true
  });
  req.session.regenerate(function () {
    req.session.lastSignedIn = new Date();
    res.redirect('/');
  });
});

module.exports = router;
