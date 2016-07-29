let express = require('express');
let staticAsset = require('static-asset');
let ms = require('ms');

module.exports = function staticInit(app, publicFolder) {
  // assets folder and caching
  app.use(express.static(publicFolder, {
    index: false,
    etag: true,
    lastModified: true,
    maxAge: ms('365 days'),
    redirect: false,
    dotfiles: 'ignore'
  }));
  // assets folder fingerprint
  app.use(staticAsset(publicFolder));
};

