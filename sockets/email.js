'use strict';

let logger = require('../helpers/logger');
let session = require('../middlewares/session-io');
let auth = require('../middlewares/auth-io');

function saveClient(clients, username, clientId, socket) {
  let client = clients[username];
  if (!client) {
    clients[username] = client = {};
  }
  client[clientId] = socket;
}

function removeClient(clients, username, clientId) {
  let client = clients[username];
  if (client) {
    delete client[clientId];
    if (Object.keys(client).length === 0) {
      delete clients[username];
    }
  }
}

function onClientConnected(clients, socket) {
  const username = socket.handshake.session.user.username;
  const clientId = socket.id;
  logger.info(`New client connected to the /emails. Username: ${username}, Socket: ${clientId}`);
  saveClient(clients, username, clientId, socket);

  socket.on('disconnect', onClientDisconnected.bind(this, clients, username, clientId));
}

function onClientDisconnected(clients, username, clientId) {
  logger.info(`Client disconnected. Username: ${username}`);
  removeClient(clients, username, clientId);
}

let lastFameEmailData = {
  unread: 2,
  total: 1421
};

function emitFakeEmailData(clients) {
  let clientNames = Object.keys(clients);
  let clientName = clientNames[Math.floor(Math.random()*clientNames.length)];
  let client = clients[clientName];
  if (!client) {
    return;
  }

  for (let key in client) {
    if (client.hasOwnProperty(key)) {
      let socket = client[key];
      if (socket) {
        socket.emit('email-status', lastFameEmailData);
      }
    }
  }

  lastFameEmailData.unread += 1;
  lastFameEmailData.total += 1;
}

function init(sockets) {
  const clients = {};

  sockets
    .of('/emails/')
    .use(session)
    .use(auth)
    .on('connection', onClientConnected.bind(this, clients));

  setInterval(emitFakeEmailData.bind(this, clients), 5000);
}

module.exports = { init };
