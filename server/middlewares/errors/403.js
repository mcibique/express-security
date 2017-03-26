import { isAjaxRequest } from 'helpers/request';

export default function handle403(err, req, res, next) {
  if (!isCsrfError(err)) {
    return next(err);
  } else {
    req.session.regenerate(function onSessionRegenerateFinished(error) {
      if (error) {
        return next(error);
      } else if (isAjaxRequest(req)) {
        res.sendStatus(403);
      } else {
        res.redirect(303, req.originalUrl);
      }
    });
  }
}

function isCsrfError(err) {
  return err.code === 'EBADCSRFTOKEN';
}
