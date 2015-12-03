'use strict';

module.exports = function handle500prod(err, req, res, next) {
  res.status(err.status || 500);
  // no stacktraces leaked to user
  res.render('error', {
    message: err.message,
    error: {}
  });
};
