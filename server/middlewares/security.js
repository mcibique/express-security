import config from '../helpers/config';
import helmet from 'helmet';
import ms from 'ms';
import uuid from 'node-uuid';

export default function initializeSecurity(app) {
  // X-Frame-Options: https://github.com/helmetjs/frameguard
  app.use(helmet.frameguard({ action: 'deny' }));
  // X-XSS-Protection: https://github.com/helmetjs/x-xss-protection
  app.use(helmet.xssFilter());
  // Strict-Transport-Security: https://github.com/helmetjs/hsts
  app.use(helmet.hsts({
    maxAge: ms(config.hsts.maxAge) / 1000,
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
  app.use(function nonceGenerator(req, res, next) {
    res.locals.nonce = uuid.v4();
    next();
  });
  /* eslint-disable quotes */
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      baseUri: ["'self'"],
      connectSrc: ["'self'", 'wss:'],
      frameAncestors: ["'none'"],
      reportUri: config.csp.reportUri
    },
    setAllHeaders: false,
    reportOnly: false,
    browserSniff: false
  })); /* eslint-enable */
  // Public-Key-Pins: https://github.com/helmetjs/hpkp
  app.use(helmet.hpkp({
    maxAge: ms(config.hpkp.maxAge) / 1000,
    sha256s: config.hpkp.sha256s,
    includeSubdomains: true,
    reportUri: config.hpkp.reportUri,
    reportOnly: false
  }));
  // X-DNS-Prefetch-Control: https://github.com/helmetjs/dns-prefetch-control
  app.use(helmet.dnsPrefetchControl({ allow: false }));
  // https://github.com/helmetjs/referrer-policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));
}
