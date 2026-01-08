const Redis = require('ioredis')

module.exports = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: `${process.env.REDIS_PREFIX}:`
})
