import cache from './cache';
import express from 'express';
import referrerPolicy from './referrer-policy';
import session from './session';

let router = express.Router();

router.use('/cache', cache);
router.use('/referrer-policy', referrerPolicy);
router.use('/session', session);

export default router;
