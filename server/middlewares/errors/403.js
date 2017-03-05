export default function handle403(err, req, res, next) {
  if (!err) {
    return next();
  } else if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  } else {
    req.session.regenerate(function onSessionRegenerateFinished(error) {
      if (error) {
        return next(error);
      } else {
        res.redirect(303, req.originalUrl);
      }
    });
  }
}
