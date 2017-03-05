'use strict';

let parseUrl = require('parseurl');
let path = require('path');
let mime = require('mime-types');
let find = require('find');
let debug = require('debug')('precompressed-assets');

const config = require('../helpers/config');

const precompressedBrotliEnabled = config.compression.precompressedAssets.brotli;
const precompressedGzipEnabled = config.compression.precompressedAssets.gzip;

module.exports = function precompressedAssets(publicFolder) {
  let precompressedCache = createCache(publicFolder);

  return function precompressedMiddleware(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    let acceptEncoding = req.headers['accept-encoding'] || '';
    let canUseBrotli = acceptEncoding.includes('br') && precompressedBrotliEnabled;
    let canUseGzip = acceptEncoding.includes('gzip') && precompressedGzipEnabled;

    if (!canUseGzip && !canUseBrotli) {
      debug(`Skipping ${req.url}. Reason: no accept-encoding.`);
      return next();
    }

    let ext = canUseBrotli ? '.br' : '.gz';
    let encoding = canUseBrotli ? 'br' : 'gzip';
    let name = {};

    name.orig = parseUrl(req).pathname.replace('/assets/', '/');
    if (!name.orig.match(/\.(html|js|css|svg)$/)) {
      debug(`Skipping ${req.url}. Reason: regex doesn't match.`);
      return next();
    }

    name.precompressed = name.orig + ext;
    name.full = path.join(publicFolder, name.precompressed);

    if (!precompressedCache.has(name.full)) {
      debug(`Skipping ${req.url}. Reason: cache miss.`);
      return next();
    }

    setHeaders(res, name.orig, encoding);
    req.url = req.url.replace(name.orig, name.precompressed);
    debug(`Serving ${req.url}.`);
    next();
  };

  function createCache(root) {
    let cache = new Set();
    find.fileSync(/\.(gz|br)$/, root).forEach(file => cache.add(file));
    debug(`Found ${cache.size} precompressed files.`);
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
};
