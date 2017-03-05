import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
  res.render('session', {
    sessionValues: req.session,
    cookieValues: req.cookies,
    signedCookieValues: req.signedCookies
  });
});

export default router;
