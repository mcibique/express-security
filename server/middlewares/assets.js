import express from 'express';
import ms from 'ms';
import staticAsset from 'static-asset';

export default function staticInit(app, publicFolder) {
  // assets folder and caching
  app.use('/assets', express.static(publicFolder, {
    fallthrough: false,
    index: false,
    etag: true,
    lastModified: true,
    maxAge: ms('365 days'),
    redirect: false,
    dotfiles: 'ignore'
  }));
  // assets folder fingerprint
  app.use(staticAsset(publicFolder));
  // handle 404 for assets
  app.use(function handleAssets404(error, req, res, next) {
    if (error) {
      if (error.statusCode === 404) {
        // do not leak any file system info to user.
        res.status(404).send('Not Found');
      } else {
        return next(error);
      }
    } else {
      return next();
    }
  });
}
