'use strict';

let extend = require('extend');
let cacheManager = require('cache-manager');
let redisStore = require('cache-manager-redis');
let logger = require('./logger');

const config = require('./config');

// level 2 cache - redis
const redisConfig = extend({}, config.caching.redis, { store: redisStore });
const redisCache = cacheManager.caching(redisConfig);

redisCache.store.events.on('redisError', (error) => {
  logger.error(error);
});

// level 1 cache - memory
const memoryConfig = extend({}, config.caching.memory, { store: 'memory' });
const memoryCache = cacheManager.caching(memoryConfig);

// cache hierarchy wrapper
const multiCache = cacheManager.multiCaching([memoryCache, redisCache]);
module.exports = multiCache;
