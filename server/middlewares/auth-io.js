import { Unauthorized } from 'http-errors';

export default function authenticateRequest(socket, next) {
  let session = socket.handshake.session;
  if (session && session.user && session.user.username) {
    return next();
  } else {
    return next(new Unauthorized());
  }
}
