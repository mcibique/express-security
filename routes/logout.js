'use strict';

let express = require('express');
let router = express.Router();
const config = require('../helpers/config');

/* GET logout page. */
router.get('/', function(req, res, next) {
  // invalidate session: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  req.session.destroy(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect(303, '/');
  });
});

module.exports = router;
