const {
  redis,
} = require('../../helpers/')

module.exports = async (ctx) => {
  ctx.assert(ctx.state.user.moderator, 403, 'Forbidden')

  const { stickerSetId, banned } = ctx.props

  ctx.assert(stickerSetId, 400, 'Bad Request: STICKER_SET_ID_REQUIRED')

  const stickerSet = await ctx.state.atlas.StickerSet.findById(stickerSetId)

  ctx.assert(stickerSet, 400, 'Bad Request: STICKER_SET_NOT_FOUND')

  const bannedUser = await ctx.state.db.User.findById(stickerSet.owner)

  ctx.assert(bannedUser, 400, 'Bad Request: USER_NOT_FOUND')

  bannedUser.publicBan = banned ? (banned === 'true') : !bannedUser.publicBan

  await bannedUser.save()

  await redis.del(`user:id:${stickerSetId._id}`)

  ctx.result = {
    banned: bannedUser.publicBan,
  }
}
