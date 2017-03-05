'use strict';

let path = require('path');
let winston = require('winston');
let os = require('os');
const isDev = require('./debug');
const logsFolder = path.join(__dirname, '..', 'logs');

module.exports = new winston.Logger({
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      level: isDev ? 'silly' : 'error',
      json: false,
      colorize: true
    }),
    new winston.transports.File({
      name: '1',
      filename: path.join(logsFolder, 'web.log'),
      level: isDev ? 'silly' : 'info',
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: -1,
      colorize: false,
      eol: os.eol,
      tailable: true
    }),
    new winston.transports.File({
      name: '2',
      filename: path.join(logsFolder, 'errors.log'),
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      level: 'error',
      json: false,
      colorize: true
    }),
    new winston.transports.File({
      filename: path.join(logsFolder, 'exceptions.log'),
      json: false,
      humanReadableUnhandledException: true
    })
  ]
});
