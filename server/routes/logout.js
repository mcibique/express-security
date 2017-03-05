import express from 'express';
let router = express.Router();

router.get('/', (req, res, next) => {
  // invalidate session: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet
  req.session.destroy(function onSessionDestroyed(err) {
    if (err) {
      return next(err);
    }
    res.redirect(303, '/');
  });
});

export default router;
