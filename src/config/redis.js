const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

const DEFAULT_EXPIRATION = 1; // 1 hour in seconds

const setCacheData = async (key, data) => {
  await redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(data));
};

const getCacheData = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const invalidateCache = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

module.exports = {
  redisClient,
  setCacheData,
  getCacheData,
  invalidateCache,
  DEFAULT_EXPIRATION
}; 