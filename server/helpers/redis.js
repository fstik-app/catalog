const Redis = require('ioredis')

module.exports = new Redis({ keyPrefix: `${process.env.REDIS_PREFIX}:` })
