import app from 'app';
import fs from 'fs';
import http from 'spdy';
import logger from 'logger';
import path from 'path';

let key = fs.readFileSync(path.join(__dirname, 'certificates/server.key'), 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
let cert = fs.readFileSync(path.join(__dirname, 'certificates/server.cert'), 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
let server = http.createServer({ key, cert }, app);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let addr = server.address();
  let bind = typeof addr === 'string'
    ? `Pipe ${addr}`
    : `Port ${addr.port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  logger.info(`Listening on ${bind}.`);
}

export default server;
