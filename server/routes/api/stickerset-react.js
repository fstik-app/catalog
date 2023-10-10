const {
  sendMetric,
} = require('../../utils/')

module.exports = async (ctx) => {
  const { stickerSetId, type } = ctx.props

  ctx.assert(stickerSetId, 400, 'Bad Request: STICKER_SET_ID_REQUIRED')
  ctx.assert(type, 400, 'Bad Request: TYPE_REQUIRED')

  const stickerSet = await ctx.state.atlas.StickerSet.findById(stickerSetId)

  ctx.assert(stickerSet, 400, 'Bad Request: STICKER_SET_NOT_FOUND')

  let reactionType

  switch (type) {
    case 'like':
      reactionType = 1
      break
    case 'dislike':
      reactionType = -1
      break
    default:
      ctx.throw(400, 'Bad Request: TYPE_INVALID')
      return
  }

  let userReaction = type

  const currentReaction = await ctx.state.db.Reaction.findOne({
    stickerSet,
    user: ctx.state.user._id,
  })

  if (currentReaction) {
    if (currentReaction.reaction === reactionType) {
      await currentReaction.remove()

      userReaction = null
    } else {
      await currentReaction.update({
        reaction: reactionType,
      })
    }
  } else {
    await ctx.state.db.Reaction.create({
      stickerSet,
      user: ctx.state.user._id,
      reaction: reactionType,
    })
  }

  const likeReactionCount = await ctx.state.db.Reaction.countDocuments({
    stickerSet,
    reaction: 1,
  })

  const dislikeReactionCount = await ctx.state.db.Reaction.countDocuments({
    stickerSet,
    reaction: -1,
  })

  if (Date.now() - stickerSet.updatedAt.getTime() > 60000) { // if sticker set was updated more than 1 minute ago
    stickerSet.reaction = {
      like: likeReactionCount,
      dislike: dislikeReactionCount,
      total: likeReactionCount - dislikeReactionCount,
    }

    await stickerSet.save()
  }

  sendMetric(ctx.state.user, 'react', userReaction, stickerSetId)

  ctx.result = {
    total: {
      like: likeReactionCount,
      dislike: dislikeReactionCount,
    },
    current: userReaction,
  }
}
