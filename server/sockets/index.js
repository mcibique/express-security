'use strict';

let extend = require('extend');
let redis = require('redis').createClient;
let redisAdapter = require('socket.io-redis');
let io = require('socket.io');
let url = require('url');
let logger = require('../helpers/logger');
let session = require('../middlewares/session-io');
let auth = require('../middlewares/session-io');
let emailSockets = require('./email');
const useCluster = require('../helpers/cluster');
const config = require('../helpers/config');

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

  let pub = redis(pubOptions);
  let sub = redis(subOptions);

  sockets.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
}

function initializeSecurity(sockets, port) {
  const allowedOrigin = url.format({
    protocol: 'https:',
    hostname: config.sockets.domain,
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
  emailSockets.init(sockets);
}

function attachToServer(server, port) {
  logger.info('Attaching socket.io to the server.');

  const sockets = io.listen(server, {
    path: '/web-sockets/'
  });

  initializeRedisStore(sockets);
  initializeSecurity(sockets, port);
  intializeSession(sockets);
  initializeAuthorization(sockets);
  initializeListeners(sockets);
}

module.exports = { attachToServer };
