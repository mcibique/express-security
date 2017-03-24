import cache from '../../helpers/caching';
import express from 'express';

let router = express.Router();

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
    res.render('debug/cache', { someCachedData, pid: process.pid });
  });
});

export default router;
