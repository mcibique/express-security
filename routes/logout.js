'use strict';

let express = require('express');
let router = express.Router();
const config = require('../config.json');

/* GET logout page. */
router.get('/', function(req, res, next) {
  res.cookie(config.authentication.cookieName, null, {
    path: config.authentication.path,
    httpOnly: true,
    secure: true,
    maxAge: -1
  });

  req.session.destroy(function(err) {
    res.redirect(303, '/');
  });
});

module.exports = router;
