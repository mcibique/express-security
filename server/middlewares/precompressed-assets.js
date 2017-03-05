import config from '../helpers/config';
import debug from 'debug';
import find from 'find';
import mime from 'mime-types';
import parseUrl from 'parseurl';
import path from 'path';

let log = debug('precompressed-assets');
let precompressedBrotliEnabled = config.compression.precompressedAssets.brotli;
let precompressedGzipEnabled = config.compression.precompressedAssets.gzip;

export default function precompressedAssets(publicFolder) {
  let precompressedCache = createCache(publicFolder);

  return function precompressedMiddleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    let acceptEncoding = req.headers['accept-encoding'] || '';
    let canUseBrotli = acceptEncoding.includes('br') && precompressedBrotliEnabled;
    let canUseGzip = acceptEncoding.includes('gzip') && precompressedGzipEnabled;

    if (!canUseGzip && !canUseBrotli) {
      log(`Skipping ${req.url}. Reason: no accept-encoding.`);
      return next();
    }

    let ext = canUseBrotli ? '.br' : '.gz';
    let encoding = canUseBrotli ? 'br' : 'gzip';
    let name = {};

    name.orig = parseUrl(req).pathname.replace('/assets/', '/');
    if (!name.orig.match(/\.(html|js|css|svg)$/)) {
      log(`Skipping ${req.url}. Reason: regex doesn't match.`);
      return next();
    }

    name.precompressed = name.orig + ext;
    name.full = path.join(publicFolder, name.precompressed);

    if (!precompressedCache.has(name.full)) {
      log(`Skipping ${req.url}. Reason: cache miss.`);
      return next();
    }

    setHeaders(res, name.orig, encoding);
    req.url = req.url.replace(name.orig, name.precompressed);
    log(`Serving ${req.url}.`);
    next();
  };

  function createCache(root) {
    let cache = new Set();
    find.fileSync(/\.(gz|br)$/, root).forEach(file => cache.add(file));
    log(`Found ${cache.size} precompressed files.`);
    return cache;
  }

  function setHeaders(res, url, encoding) {
    let type = mime.lookup(url);
    let charset = mime.charset(type);
    if (charset) {
      charset = `; charset=${charset}`;
    }

    res.setHeader('Content-Type', `${type}${charset || ''}`);
    res.setHeader('Content-Encoding', encoding);
    res.setHeader('Vary', 'Accept-Encoding');
  }
}
