const { createClient } = require('redis');

let redisClient = null;

async function createRedisClient() {
  const redisUrl = process.env.REDIS_URL || 'redis://:redis@localhost:6379';
  
  redisClient = createClient({
    url: redisUrl
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Redis connected'));

  await redisClient.connect();
  return redisClient;
}

async function getRedisClient() {
  if (!redisClient) {
    await createRedisClient();
  }
  return redisClient;
}

async function cacheGet(key) {
  const client = await getRedisClient();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

async function cacheSet(key, value, ttlSeconds = 300) {
  const client = await getRedisClient();
  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

async function cacheDelete(key) {
  const client = await getRedisClient();
  await client.del(key);
}

async function cacheDeletePattern(pattern) {
  const client = await getRedisClient();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
}

module.exports = {
  createRedisClient,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern
};
