const { Telegram } = require('telegraf')

const telegram = new Telegram(process.env.BOT_TOKEN)

module.exports = async (ctx) => {
  const { name } = ctx.props

  ctx.assert(name, 400, 'Bad Request: NAME_REQUIRED')

  ctx.assert(!name.match(/_by_(.*)bot$/gmi), 400, 'Bad Request: STICKER_MUST_NOT_BE_BOT')

  // Can contain only English letters, digits and underscores
  const safeName = name.replace(/[^a-zA-Z0-9_]/g, '')
  const findStickerSet = await ctx.state.db.StickerSet.findOne({
    name: safeName,
  })

  if (findStickerSet) {
    ctx.result = {}
    return
  }

  const stickerSet = await telegram.getStickerSet(name)

  ctx.assert(stickerSet.stickers.length >= 7, 400, 'Bad Request: STICKER_SET_TOO_SMALL')

  ctx.assert(stickerSet, 400, 'Bad Request: STICKER_SET_NOT_FOUND')

  await ctx.state.db.StickerSet.create({
    name: stickerSet.name,
    title: stickerSet.title,
    animated: stickerSet.is_animated,
    video: stickerSet.is_video,
    packType: stickerSet.sticker_type,
    thirdParty: true,
    about: {
      description: stickerSet.description,
      safe: false,
    },
    public: true,
    publishDate: new Date(),
  })

  ctx.result = stickerSet
}
