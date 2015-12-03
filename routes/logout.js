var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
  res.cookie('auth', null, {
    path: '/',
    httpOnly: true,
    secure: true,
    maxAge: -1
  });

  req.session.destroy(function(err) {
    res.redirect(303, '/');
  });
});

module.exports = router;
