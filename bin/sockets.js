'use strict';

let io = require('socket.io');
let url = require('url');
let logger = require('../helpers/logger');
let emailSockets = require('../sockets/email');
const config = require('../helpers/config');

function initializeSecurity(sockets, port) {
  const allowedOrigin = url.format({
    protocol: 'https:',
    hostname: config.sockets.domain,
    port
  });
  logger.info(`Sockets origins set to ${allowedOrigin}.`);
  sockets.origins(allowedOrigin);
}

function initializeListeners(sockets) {
  emailSockets.init(sockets);
}

function attachToServer(server, port) {
  logger.info('Attaching socket.io to the server.');

  const sockets = io.listen(server, {
    path: '/web-sockets/'
  });

  initializeSecurity(sockets, port);
  initializeListeners(sockets);
}

module.exports = { attachToServer };
