'use strict';

let express = require('express');
let router = express.Router();
const config = require('../helpers/config');

/* GET logout page. */
router.get('/', function(req, res, next) {
  // remove auth cookie
  res.cookie(config.authentication.cookieName, null, {
    path: config.authentication.path,
    httpOnly: true,
    secure: true,
    maxAge: -1
  });
  // invalidate session: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  req.session.destroy(function(err) {
    res.redirect(303, '/');
  });
});

module.exports = router;
