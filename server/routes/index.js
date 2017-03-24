import debug from './debug';
import express from 'express';
import home from './home';
import IS_DEBUG from '../helpers/debug';
import login from './login';
import logout from './logout';
import user from './user';

let router = express.Router();
router.use('/', home);
router.use('/login', login);
router.use('/logout', logout);
router.use('/user', user);

if (IS_DEBUG) {
  router.use('/', debug);
}

export default router;
