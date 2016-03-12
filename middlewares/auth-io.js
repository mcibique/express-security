'use strict';

module.exports = function authenticateRequest(socket, next) {
  let session = socket.handshake.session;
  if (session && session.user && session.user.username) {
    next();
  } else {
    next(new Error('Unauthorized.'));
  }
}