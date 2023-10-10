const responseTime = require('koa-response-time')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const Koa = require('koa')
const cors = require('@koa/cors')

const app = new Koa()

app.use(cors())
app.use(responseTime())
app.use(bodyParser())

app.keys = [process.env.SESSION_SECRET]

app.use(require('./helpers').helpersApi)

const db = require('./database')

const Redis = require('ioredis')
const redis = new Redis({ keyPrefix: `${process.env.REDIS_PREFIX}:` })

const { Telegram } = require('telegraf')
const telegram = new Telegram(process.env.BOT_TOKEN)

app.use(async (ctx, next) => {
  ctx.state.db = db.collections
  ctx.state.atlas = db.atlasCollections
  ctx.state.redis = redis
  ctx.state.tg = telegram

  await next()
})

const route = new Router()

const {
  routeFile,
  routeApi,
  routeSitemap,
} = require('./routes')

route.get('/sitemap/:total.:offset.xml', routeSitemap)
route.get('/sitemap/:name.xml', routeSitemap)
route.get('/file/:fileId/:ex', routeFile)
route.use(routeApi.routes())

app.use(route.routes())

app.on('error', err => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('sent error %s to the cloud', err.message)
    console.log(err)
  }
})

db.connection.once('open', () => {
  console.log('Connected to MongoDB')

  const port = process.env.PORT || 4000

  app.listen(port, () => {
    console.log('Listening on localhost, port', port)
  })
})
