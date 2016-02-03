'use strict';

let app = require('../app.js');
let logger = require('../helpers/logger');
let http = require('https');
let fs = require('fs');

const key = fs.readFileSync('certificates/server.key', 'utf8');
const cert = fs.readFileSync('certificates/server.cert', 'utf8');
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
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
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

module.exports = server;
