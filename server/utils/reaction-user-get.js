const db = require('../database')

module.exports = async (stickerSetId, user) => {
  const currentReaction = await db.collections.Reaction.findOne({
    stickerSet: stickerSetId,
    user: user._id,
  })

  let reactionText = null
  if (currentReaction && currentReaction.reaction !== null) {
    reactionText = currentReaction.reaction === 1 ? 'like' : 'dislike'
  }

  return reactionText
}
