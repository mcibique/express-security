'use strict';

let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
  // invalidate session: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(303, '/');
  });
});

module.exports = router;
