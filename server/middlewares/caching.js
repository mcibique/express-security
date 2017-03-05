import helmet from 'helmet';

export default function initializeCaching(app) {
  // disable etags for all requests
  app.disable('etag');
  // disable cache for all requests: https://github.com/helmetjs/nocache
  app.use(helmet.noCache());
}
