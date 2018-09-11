import { IS_DEBUG } from 'config';
import os from 'os';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import WinstonToDebugLogger from 'helpers/winston/winston-to-debug';

const LOGS_FOLDER = path.join(__dirname, '..', 'logs');

export default createLogger({
  exitOnError: false,
  transports: [
    new WinstonToDebugLogger({
      level: IS_DEBUG ? 'silly' : 'error'
    }),
    new transports.File({
      name: '1',
      filename: path.join(LOGS_FOLDER, 'web.log'),
      level: IS_DEBUG ? 'silly' : 'info',
      format: format.combine(
        format.uncolorize(),
        format.timestamp(),
        format.padLevels(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      maxsize: 5242880, // 5MB
      maxFiles: -1,
      eol: os.eol,
      tailable: true
    }),
    new transports.File({
      name: '2',
      filename: path.join(LOGS_FOLDER, 'errors.log'),
      format: format.simple(),
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new transports.Console({
      level: 'error'
    }),
    new transports.File({
      filename: path.join(LOGS_FOLDER, 'exceptions.log'),
      format: format.simple(),
      humanReadableUnhandledException: true
    })
  ]
});
