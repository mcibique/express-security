import { isAjaxRequest } from '../../helpers/request';
import logger from '../../helpers/logger';

export default function handle500prod(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err);
  res.status(err.status || 500);

  if (isAjaxRequest(req)) {
    res.send({ error: err.message });
  } else {
    res.render('error', {
      message: err.message,
      error: {} // no stacktraces leaked to user
    });
  }
}
