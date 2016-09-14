'use strict';

let compression = require('compression');
let precompressedAssets = require('./precompressed-assets');

const config = require('../helpers/config');

const precompressedBrotliEnabled = config.compression.precompressedAssets.brotli;
const precompressedGzipEnabled = config.compression.precompressedAssets.gzip;

module.exports = function initCompression(app, publicFolder) {
  if (precompressedBrotliEnabled || precompressedGzipEnabled) {
    app.use(precompressedAssets(publicFolder));
  }

  app.use(compression({
    threshold: config.compression.threshold
  }));
};
