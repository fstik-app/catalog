const {
  redis,
} = require('../../helpers/')

module.exports = async (ctx) => {
  ctx.assert(ctx.state.user.moderator, 403, 'Forbidden')

  const { stickerSetId, isPublic } = ctx.props

  ctx.assert(stickerSetId, 400, 'Bad Request: STICKER_SET_ID_REQUIRED')

  const stickerSet = await ctx.state.atlas.StickerSet.findById(stickerSetId)

  ctx.assert(stickerSet, 400, 'Bad Request: STICKER_SET_NOT_FOUND')

  stickerSet.public = isPublic ? (isPublic === 'true') : !stickerSet.public
  await stickerSet.save()

  await redis.del(`stickerSet:id:${stickerSetId}`)

  ctx.result = {
    public: stickerSet.public,
  }
}
