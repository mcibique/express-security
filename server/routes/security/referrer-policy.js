import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
  res.render('security/referrer-policy');
});

export default router;
