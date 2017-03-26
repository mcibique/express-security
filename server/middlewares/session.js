import config, { IS_DEBUG } from 'config';
import connectRedis from 'connect-redis';
import ms from 'ms';
import session from 'express-session';

let store;

if (config.session.redis) {
  let RedisStore = connectRedis(session);
  store = new RedisStore(config.session.redis);
} else if (IS_DEBUG) {
  store = new session.MemoryStore();
} else {
  throw new Error('Unable to configure session store.');
}

export default session({
  store,
  name: config.session.cookieName,
  resave: false,
  rolling: true,
  saveUninitialized: true,
  secret: config.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: ms(config.session.expiration),
    sameSite: true
  }
});
