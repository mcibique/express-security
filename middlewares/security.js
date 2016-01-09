'use strict';

let helmet = require('helmet');
let ms = require('ms');

const config = require('../helpers/config');

module.exports = function initializeSecurity(app) {
  // X-Frame-Options: https://github.com/helmetjs/frameguard
  app.use(helmet.frameguard('deny'));
  // X-XSS-Protection: https://github.com/helmetjs/x-xss-protection
  app.use(helmet.xssFilter());
  // Strict-Transport-Security: https://github.com/helmetjs/hsts
  app.use(helmet.hsts({
    maxAge: ms(config.hsts.maxAge),
    includeSubdomains: true,
    preload: true
  }));
  // X-Powered-By: http://expressjs.com/en/4x/api.html#app.settings.table
  app.disable('x-powered-by');
  // X-Download-Options: https://github.com/helmetjs/ienoopen
  app.use(helmet.ieNoOpen());
  // X-Content-Type-Options: https://github.com/helmetjs/dont-sniff-mimetype
  app.use(helmet.noSniff());
  // Content-Security-Policy: https://github.com/helmetjs/csp
  /* eslint quotes: 0 */
  app.use(helmet.csp({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    baseUri: ["'self'"],
    frameAncestors: ["'none'"],
    reportUri: config.csp.reportUri,
    reportOnly: false
  }));
  // Public-Key-Pins: https://github.com/helmetjs/hpkp
  app.use(helmet.publicKeyPins({
    maxAge: ms(config.hpkp.maxAge),
    sha256s: config.hpkp.sha256s,
    includeSubdomains: true,
    reportUri: config.hpkp.reportUri,
    reportOnly: false
  }));
};
