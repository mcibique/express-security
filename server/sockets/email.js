import auth from 'middlewares/auth-io';
import logger from 'logger';
import session from 'middlewares/session-io';

function saveClient(clients, username, clientId, socket) {
  let client = clients.get(username);
  if (!client) {
    client = new Map();
    clients.set(username, client);
  }
  client.set(clientId, socket);
}

function removeClient(clients, username, clientId) {
  let client = clients.get(username);
  if (client) {
    client.delete(clientId);
    if (client.size === 0) {
      clients.delete(username);
    }
  }
}

function onClientConnected(clients, socket) {
  let username = socket.handshake.session.user.username;
  let clientId = socket.id;
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

function pickRandomConnectedClient(clients) {
  if (clients.size === 0) {
    return null;
  }
  let client = null;
  let randomIndex = Math.floor(Math.random() * clients.size);
  let currentIndex = 0;
  let iterator = clients.values();
  while (currentIndex <= randomIndex) {
    client = iterator.next().value;
    currentIndex++;
  }
  return client;
}

function emitFakeEmailData(clients) {
  let client = pickRandomConnectedClient(clients);
  if (!client) {
    return;
  }

  for (let socket of client.values()) {
    socket.emit('email-status', lastFameEmailData);
  }

  lastFameEmailData.unread += 1;
  lastFameEmailData.total += 1;
}

function init(sockets) {
  let clients = new Map();

  sockets
    .of('/emails/')
    .use(session)
    .use(auth)
    .on('connection', onClientConnected.bind(this, clients));

  setInterval(emitFakeEmailData.bind(this, clients), 5000);
}

export default init;
