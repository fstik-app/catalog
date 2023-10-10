const { verifyToken } = require('../../services/firebase')

module.exports = async (ctx, next) => {
  if (ctx.props.firebase_token) {
    const decodedToken = await verifyToken(ctx.props.firebase_token)

    if (!decodedToken) {
      ctx.throw(401, 'Firebase token is invalid')
    }

    const user = await ctx.state.db.AppUser.findOne({
      provider: 'firebase',
      uid: decodedToken.uid,
    })

    if (!user) {
      const newUser = await ctx.state.db.AppUser.create({
        provider: 'firebase',
        uid: decodedToken.uid,
      })

      ctx.state.user = newUser
    } else {
      ctx.state.user = user
    }

    return next()
  }

  if (!ctx.props.user_token) {
    ctx.state.user = {
      moderator: false,
      anonymous: true,
    }

    await next()
    return
  }

  const userId = await ctx.state.redis.get(`user:${ctx.props.user_token}`)

  ctx.assert(userId, 401, 'User token is invalid')

  const telegramUser = await ctx.state.db.User.findOne({
    telegram_id: userId,
  })

  const user = await ctx.state.db.AppUser.findOne({
    provider: 'telegram',
    uid: telegramUser.telegram_id,
  })

  if (!user) {
    const newUser = await ctx.state.db.AppUser.create({
      _id: telegramUser._id,
      provider: 'telegram',
      uid: telegramUser.telegram_id,
    })

    ctx.state.user = newUser
  } else {
    ctx.state.user = user
  }

  await next()
}
