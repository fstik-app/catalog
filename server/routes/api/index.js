const logger = require('koa-logger')
const ratelimit = require('koa-ratelimit')
const Router = require('koa-router')
const { userAgent } = require('koa-useragent')
const Redis = require('ioredis')

const api = new Router()

api.use(logger())

const ratelimitConfig = {
  driver: 'redis',
  db: new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  }),
  duration: 1000 * 50,
  errorMessage: {
    ok: false,
    error: {
      code: 429,
      message: 'Rate limit exceeded. See "Retry-After"',
    },
  },
  id: (ctx) => {
    return `global:${ctx.props?.user_token || ctx.get('X-Real-IP')}`
  },
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  max: 100,
  disableHeader: false,
  whitelist: (ctx) => {
    const { token } = ctx.props

    if (token) {
      try {
        const whitelist = require('../../whitelist.json')

        if (whitelist.includes(token)) {
          return true
        }
      } catch (e) {
        return false
      }
    }
  },
  blacklist: (ctx) => {
  },
}

api.use(ratelimit(ratelimitConfig))

api.use(userAgent)

const authRatelimitConfig = Object.assign({}, ratelimitConfig, {
  max: 25,
  id: (ctx) => {
    return `auth:${ctx.props?.user_token || ctx.get('X-Real-IP')}`
  },
})

api
  .get('/authUser', ratelimit(authRatelimitConfig), require('./user-auth'))
  .post('/authUser', ratelimit(authRatelimitConfig), require('./user-auth'))

api
  .get('/adMobReward', require('./admob-reward-callback'))
  .post('/adMobReward', require('./admob-reward-callback'))

api.use(require('./check-auth'))
api.use(require('./update-client'))

api
  .get('/reward', require('./reward-check'))
  .post('/reward', require('./reward-check'))

api
  .get('/searchStickerSet', require('./stickerset-search'))
  .post('/searchStickerSet', require('./stickerset-search'))

api
  .get('/getStickerSetByName', require('./stickerset-get-by-name'))
  .post('/getStickerSetByName', require('./stickerset-get-by-name'))

api
  .get('/searchProducts', require('./product-search'))
  .post('/searchProducts', require('./product-search'))

api
  .get('/publishStickerSet', require('./stickerset-publish'))
  .post('/publishStickerSet', require('./stickerset-publish'))

api.use(async (ctx, next) => {
  ctx.assert(ctx.state.user, 401, 'Unauthorized')

  await next()
})

const reactRatelimitConfig = Object.assign({}, ratelimitConfig, {
  max: 20,
  id: (ctx) => {
    return `react:${ctx.props?.user_token}`
  },
})

api
  .get('/reactStickerSet', ratelimit(reactRatelimitConfig), require('./stickerset-react'))
  .post('/reactStickerSet', ratelimit(reactRatelimitConfig), require('./stickerset-react'))

const metricRatelimitConfig = Object.assign({}, ratelimitConfig, {
  max: 25,
  id: (ctx) => {
    return `metric:${ctx.props?.user_token}`
  },
})

api
  .get('/sendMetric', ratelimit(metricRatelimitConfig), require('./metric-send'))
  .post('/sendMetric', ratelimit(metricRatelimitConfig), require('./metric-send'))

api
  .get('/updateStickerSetSafe', require('./stickerset-safe'))
  .post('/updateStickerSetSafe', require('./stickerset-safe'))

api
  .get('/updateStickerSetPublic', require('./stickerset-public'))
  .post('/updateStickerSetPublic', require('./stickerset-public'))

api
  .get('/banUser', require('./user-ban'))
  .post('/banUser', require('./user-ban'))

module.exports = api
