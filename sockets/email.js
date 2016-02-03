'use strict';

let logger = require('../helpers/logger');

function onClientConnected(socket) {
  logger.info('New client connected to the /emails.');
  socket.emit('email-status', {
    unread: 2,
    total: 1421
  });
}

function onClientDisconnected() {
  logger.info('Client disconnected.');
}

function init(sockets) {
  sockets
    .of('/emails/')
    .on('connection', onClientConnected)
    .on('disconnect', onClientDisconnected);
}

module.exports = { init };
