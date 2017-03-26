import { normalizePort, SERVER_PORT as PORT } from '../helpers/port';
import config from '../helpers/config';
import { Forbidden } from 'http-errors';
import url from 'url';

export default function (req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  let identifier = req.headers.origin || req.header.referer;

  if (identifier) {
    if (!isValidIdentifier(identifier)) {
      let error = new Forbidden('Invalid origin or referer');
      return next(error);
    }
  }

  next();
}

function isValidIdentifier(identifier) {
  let identifierParsed = url.parse(identifier);
  return identifierParsed.protocol === 'https:' &&
    identifierParsed.hostname === config.domain &&
    normalizePort(identifierParsed.port) === PORT;
}
