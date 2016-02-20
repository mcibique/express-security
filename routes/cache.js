'use strict';

let express = require('express');
let router = express.Router();

let cache = require('../helpers/caching');

router.get('/', (req, res, next) => {
  function getSomeCachedData(cb) {
    setTimeout(() => {
      cb(null, { someDate: new Date() });
    }, 250);
  }

  const ttl = { ttl: 120 };

  cache.wrap('some-cached-data', getSomeCachedData, ttl, (err, someCachedData) => {
    if (err) {
      return next(err);
    }
    res.render('cache', { someCachedData });
  });
});

module.exports = router;
