import cookies from '../middlewares/cookies';
import ioSession from 'express-socket.io-session';
import session from '../middlewares/session';

export default ioSession(session, cookies, {
  autoSave: true
});
