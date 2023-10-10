const db = require('../database')

module.exports = async (stickerSetId) => {
  const likeReactionCount = await db.collections.Reaction.countDocuments({
    stickerSet: stickerSetId,
    reaction: 1,
  })

  const dislikeReactionCount = await db.collections.Reaction.countDocuments({
    stickerSet: stickerSetId,
    reaction: -1,
  })

  return {
    like: likeReactionCount,
    dislike: dislikeReactionCount,
  }
}
