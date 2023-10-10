const { Telegram } = require('telegraf')
const {
  redis,
} = require('../helpers/')

const REDIS_PREFIX = 'stickerSet'

const telegram = new Telegram(process.env.BOT_TOKEN)

module.exports = async (stickerSet) => {
  const stickerSetTG = await telegram.getStickerSet(stickerSet.name).catch(error => {
    console.log(error)
    return null
  })

  if (!stickerSetTG || stickerSetTG.length <= 0) {
    return null
  }

  let stickerSetType
  if (stickerSetTG.is_animated) {
    stickerSetType = 'animated'
  } else if (stickerSetTG.is_video) {
    stickerSetType = 'video'
  } else {
    stickerSetType = 'image'
  }

  const stickers = stickerSetTG.stickers.map(sticker => {
    const stickerInfo = {
      file_id: sticker.file_id,
      width: sticker.width,
      height: sticker.height,
    }

    if (sticker.thumb) {
      stickerInfo.thumb = {
        file_id: sticker.thumb.file_id,
        width: sticker.thumb.width,
        height: sticker.thumb.height,
      }
    }

    return stickerInfo
  })

  let title = stickerSetTG.title

  // remove wotermark from title
  title = title.replace('by @fStikBot', '')
  title = title.replace(':: @fStikBot', '')
  title = title.trim()

  let about

  if (stickerSet.about) {
    about = {
      description: stickerSet?.about.description,
      languages: stickerSet?.about.langs,
      tags: stickerSet?.about.tags,
      safe: stickerSet?.about.safe,
      verified: stickerSet?.about.verified,
    }
  }

  if (!stickerSet.reaction) {
    stickerSet.reaction = {
      like: 0,
      dislike: 0,
      total: 0,
    }
  }

  const stickerSetInfo = {
    id: stickerSet._id,
    name: stickerSet.name,
    title,
    description: about?.description || '',
    languages: about?.languages || [],
    tags: about?.tags || [],
    public: stickerSet.public,
    safe: about?.safe,
    verified: about?.verified,
    type: stickerSetType,
    reaction: stickerSet.reaction,
    installations: stickerSet.installations || {},
    stickers,
  }

  redis.set(
    `${REDIS_PREFIX}:id:${stickerSetInfo.id}`,
    JSON.stringify(stickerSetInfo),
    'EX', 60 * 60 * 3, // 3 hours
  )

  return stickerSetInfo
}
