const geoip = require('geoip-lite')
const {
  aliexpress,
} = require('../../helpers')

module.exports = async (ctx) => {
  const { query } = ctx.props

  ctx.assert(query, 400, 'Bad Request: QUERY_REQUIRED')

  const geo = geoip.lookup(ctx.headers['x-real-ip'] || ctx.ip)

  const result = await aliexpress.search(query, geo?.country)

  ctx.result = result
}
