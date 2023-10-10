const geoip = require('geoip-lite')

module.exports = async (ctx, next) => {
  if (ctx.state.user && !ctx.state.user.anonymous) {
    const geo = geoip.lookup(ctx.headers['x-real-ip'] || ctx.ip)

    ctx.state.user.client = {
      country: geo?.country,
      platform: ctx.userAgent?.platform,
      browser: ctx.userAgent?.browser,
      version: ctx.userAgent?.version,
      os: ctx.userAgent?.os,
    }

    ctx.state.user.updatedAt = new Date()

    await ctx.state.user.save()
  }

  await next()
}
