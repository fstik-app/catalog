const mongoose = require('mongoose')
const db = require('../database')

module.exports = async (user, type, value, stickerSetId) => {
  const dateNow = new Date()
  dateNow.setHours(0, 0, 0, 0)

  const metadata = {
    type,
    user: user._id,
  }

  if (value) {
    metadata.value = value
  }

  if (stickerSetId) {
    metadata.stickerSet = mongoose.Types.ObjectId(stickerSetId)
  }

  const metric = await db.collections.Metric.findOne({
    metadata,
    timestamp: {
      $gte: dateNow,
    },
  })

  if (metric) {
    return { ok: true }
  }

  if (type === 'add') {
    const lastAddMetric = await db.collections.Metric.findOne({
      'metadata.type': 'add',
      'metadata.stickerSet': metadata.stickerSet,
    }).sort({ timestamp: -1 })

    if (!lastAddMetric || Date.now() - lastAddMetric.timestamp.getTime() > 60 * 1000) {
      const stickerSet = await db.atlasCollections.StickerSet.findById(stickerSetId)

      if (stickerSet) {
        const todayAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: dateNow,
          },
          'metadata.type': 'add',
          'metadata.stickerSet': metadata.stickerSet,
        })

        const weekAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: new Date(dateNow.getTime() - 604800000), // 7 days
          },
          'metadata.type': 'add',
          'metadata.stickerSet': metadata.stickerSet,
        })

        const monthAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: new Date(dateNow.getTime() - 2592000000), // 30 days
          },
          'metadata.type': 'add',
          'metadata.stickerSet': metadata.stickerSet,
        })

        const totalAddCount = await db.collections.Metric.countDocuments({
          'metadata.type': 'add',
          'metadata.stickerSet': metadata.stickerSet,
        })

        await stickerSet.update({
          installations: {
            day: todayAddCount,
            week: weekAddCount,
            month: monthAddCount,
            total: totalAddCount,
          },
        })
      }
    }
  }

  await db.collections.Metric.create({
    metadata,
  })

  return { ok: true }
}
