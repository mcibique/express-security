import debug from 'debug';
import Transport from 'winston-transport';

export default class WinstonToDebugLogger extends Transport {
  constructor(options) {
    super(options);
    this.name = options.name || 'WinstonToDebugLogger';
    this.level = options.level || 'info';
    this.prefix = options.prefix || 'app';
  }

  log({ level, message }, cb) {
    debug(`${this.prefix}:${level}`)(message);
    cb(null, true);
  }
}
