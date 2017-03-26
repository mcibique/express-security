import debug from 'routes/debug';
import express from 'express';
import home from 'routes/home';
import { IS_DEBUG } from 'config';
import login from 'routes/login';
import logout from 'routes/logout';
import user from 'routes/user';

let router = express.Router();
router.use('/', home);
router.use('/login', login);
router.use('/logout', logout);
router.use('/user', user);

if (IS_DEBUG) {
  router.use('/', debug);
}

export default router;
