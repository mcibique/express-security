'use strict';

let winston = require('winston');
let os = require('os');
const isDev = require('./debug');

module.exports = new winston.Logger({
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      level: isDev ? 'silly' : 'error',
      json: false,
      colorize: true,
    }),
    new winston.transports.File({
      name: '1',
      filename: 'logs/web.log',
      level: isDev ? 'silly' : 'info',
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: -1,
      colorize: false,
      eol: os.eol,
      tailable: true
    }),
    new winston.transports.File({
      name: '2',
      filename: 'logs/errors.log',
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      json: false,
      humanReadableUnhandledException: true
    })
  ]
});
