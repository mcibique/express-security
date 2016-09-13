'use strict';

let RateLimit = require('express-rate-limit');
let RateLimitStore = require('rate-limit-redis');
let redis = require('redis');

const config = require('./config');

function getLimiterFor(prefix, max, duration, keyGenerator) {
  if (!keyGenerator) {
    throw new Error('Key generator must be specified.');
  }

  if (!config.rateLimiter.enabled) {
    // return empty middleware
    return (req, res, next) => next();
  }

  let store = new RateLimitStore({
    prefix: `${config.rateLimiter.prefix}-${prefix || ''}`,
    client: redis.createClient(config.rateLimiter.redis)
  });

  return new RateLimit({
    windowMs: duration,
    max,
    delayMs: config.rateLimiter.delay,
    delayAfter: max,
    headers: config.rateLimiter.headers,
    keyGenerator,
    store
  });
}

module.exports = { getLimiterFor };
