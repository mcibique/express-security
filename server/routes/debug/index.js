import cache from 'routes/debug/cache';
import express from 'express';
import referrerPolicy from 'routes/debug/referrer-policy';
import session from 'routes/debug/session';

let router = express.Router();

router.use('/cache', cache);
router.use('/referrer-policy', referrerPolicy);
router.use('/session', session);

export default router;
