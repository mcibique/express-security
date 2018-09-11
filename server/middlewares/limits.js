import ms from 'ms';
import { getLimiterFor } from 'helpers/rate-limiters';

export default function initApiRateLimits(app) {
  // limits maximum 30 requests per 1 minute from the same IP.
  let max = 30;
  let duration = ms('1m');
  let keyGenerator = req => req.ip;
  app.use(getLimiterFor('api', max, duration, keyGenerator));
}
