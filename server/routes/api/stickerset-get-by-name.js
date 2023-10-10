const {
  sendMetric,
  stickerSetInfo,
  getReaction,
  getUserReaction,
} = require('../../utils')

module.exports = async (ctx) => {
  const { name } = ctx.props

  ctx.assert(name, 400, 'Bad Request: NAME_REQUIRED')

  const findStickerSet = await ctx.state.atlas.StickerSet.findOne({
    name: name.toLowerCase(),
  }).collation(
    { locale: 'en', strength: 2 },
  )

  ctx.assert(findStickerSet, 404, 'Bad Request: STICKER_SET_NOT_FOUND')

  const stickerSet = await stickerSetInfo(findStickerSet)

  if (!ctx.state.user.moderator) {
    ctx.assert(stickerSet.safe, 404, 'Bad Request: STICKER_SET_NOT_FOUND')
    ctx.assert(stickerSet.public, 404, 'Bad Request: STICKER_SET_NOT_FOUND')
  }

  const reaction = await getReaction(stickerSet.id)

  stickerSet.reaction = reaction

  stickerSet.reaction.current = await getUserReaction(stickerSet.id, ctx.state.user)

  sendMetric(ctx.state.user, 'view', 'full', stickerSet.id)

  ctx.result = stickerSet
}
