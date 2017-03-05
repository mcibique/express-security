import cache from './cache';
import express from 'express';
import home from './home';
import IS_DEBUG from '../helpers/debug';
import login from './login';
import logout from './logout';
import security from './security';
import session from './session';
import user from './user';

let router = express.Router();
router.use('/', home);
router.use('/login', login);
router.use('/logout', logout);
router.use('/user', user);

if (IS_DEBUG) {
  router.use('/cache', cache);
  router.use('/security', security);
  router.use('/session', session);
}

export default router;
