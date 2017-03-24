import IS_DEBUG from './debug';
import os from 'os';
import path from 'path';
import winston from 'winston';
import WinstonToDebugLogger from './winston/winston-to-debug';

const LOGS_FOLDER = path.join(__dirname, '..', 'logs');

export default new winston.Logger({
  exitOnError: false,
  transports: [
    new WinstonToDebugLogger({
      level: IS_DEBUG ? 'silly' : 'error'
    }),
    new winston.transports.File({
      name: '1',
      filename: path.join(LOGS_FOLDER, 'web.log'),
      level: IS_DEBUG ? 'silly' : 'info',
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: -1,
      colorize: false,
      eol: os.eol,
      tailable: true
    }),
    new winston.transports.File({
      name: '2',
      filename: path.join(LOGS_FOLDER, 'errors.log'),
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
      filename: path.join(LOGS_FOLDER, 'exceptions.log'),
      json: false,
      humanReadableUnhandledException: true
    })
  ]
});
