import cacheManager from 'cache-manager';
import config from 'config';
import extend from 'extend';
import logger from 'logger';
import redisStore from 'cache-manager-redis';

// level 2 cache - redis
let redisConfig = extend({}, config.caching.redis, { store: redisStore });
let redisCache = cacheManager.caching(redisConfig);

redisCache.store.events.on('redisError', function onRedisCacheError(error) {
  logger.error(error);
});

// level 1 cache - memory
let memoryConfig = extend({}, config.caching.memory, { store: 'memory' });
let memoryCache = cacheManager.caching(memoryConfig);

// cache hierarchy wrapper
let multiCache = cacheManager.multiCaching([memoryCache, redisCache]);
export default multiCache;
