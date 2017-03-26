import auth from '../middlewares/session-io';
import config from '../helpers/config';
import { createClient } from 'redis';
import emailSockets from './email';
import extend from 'extend';
import io from 'socket.io';
import logger from '../helpers/logger';
import redisAdapter from 'socket.io-redis';
import session from '../middlewares/session-io';
import url from 'url';
import useCluster from '../helpers/cluster';

function initializeRedisStore(sockets) {
  if (!useCluster) {
    logger.info(`Skipping redis store for socket.io. userCluster: ${useCluster}`);
    return;
  }

  let options = config.sockets.redis;
  let pubOptions = extend({}, options);
  let subOptions = extend({}, options, {
    return_buffers: true
  });

  let pub = createClient(pubOptions);
  let sub = createClient(subOptions);

  sockets.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
}

function initializeSecurity(sockets, port) {
  const allowedOrigin = url.format({
    protocol: 'https:',
    hostname: config.domain,
    port
  });
  logger.info(`Sockets origins set to ${allowedOrigin}.`);
  sockets.origins(allowedOrigin);
}

function intializeSession(sockets) {
  sockets.use(session);
}

function initializeAuthorization(sockets) {
  sockets.use(auth);
}

function initializeListeners(sockets) {
  emailSockets(sockets);
}

function attachToServer(server, port) {
  logger.info('Attaching socket.io to the server.');

  let sockets = io.listen(server, {
    path: config.sockets.root
  });

  initializeRedisStore(sockets);
  initializeSecurity(sockets, port);
  intializeSession(sockets);
  initializeAuthorization(sockets);
  initializeListeners(sockets);
}

export { attachToServer };
