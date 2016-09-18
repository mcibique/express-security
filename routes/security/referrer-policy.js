'use strict';

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.render('security/referrer-policy');
});

module.exports = router;
