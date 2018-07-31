import app from 'app';
import fs from 'fs';
import http from 'spdy';
import logger from 'logger';
import path from 'path';
import { SERVER_PORT as PORT } from 'helpers/port';

let key = fs.readFileSync(path.join(__dirname, 'certificates/server.key'), 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
let cert = fs.readFileSync(path.join(__dirname, 'certificates/server.cert'), 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
let server = http.createServer({ key, cert }, app);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Pipe ${PORT} requires elevated privileges.`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  logger.info(`Listening on ${PORT}.`);
}

export default server;
