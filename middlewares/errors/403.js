'use strict';

module.exports = function handle403(err, req, res, next) {
  if (!err) {
    next();
  } else if (err.code !== 'EBADCSRFTOKEN') {
    next(err);
  } else {
    req.session.regenerate((err) => {
      if (err) {
        next(err);
      } else {
        res.redirect(303, req.originalUrl);
      }
    })
  }
};
