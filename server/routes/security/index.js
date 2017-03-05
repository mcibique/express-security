import express from 'express';
import referrerPolicy from './referrer-policy';

let router = express.Router();
router.use('/referrer-policy', referrerPolicy);

export default router;
