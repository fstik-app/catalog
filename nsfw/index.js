require('dotenv').config({ path: './.env' })
const got = require('got')
const sharp = require('sharp')
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const { Telegram } = require('telegraf')
const {
  getFile
} = require('./utils')
const db = require('./database')
tf.enableProdMode()

const telegram = new Telegram(process.env.BOT_TOKEN)

async function nsfwCheck (model, fileLink) {
  const fileBuffer = await got(fileLink, {
    encoding: null
  }).then(res => res.body)

  const imageSharp = sharp(fileBuffer)

  const jpegBuffer = await imageSharp.jpeg().toBuffer()

  const image = tf.node.decodeImage(jpegBuffer, 3)
  const predictions = await model.classify(image)
  image.dispose()

  let result = {}

  predictions.forEach(prediction => {
    result[prediction.className] = parseInt(prediction.probability * 100)
  })

  return result
}

async function promiseAllChunked (array, chunkSize) {
  const chunkedArray = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize))
  }

  const result = []

  for (const chunk of chunkedArray) {
    result.push(...await Promise.all(chunk))
  }

  return result
}

(async () => {
  let model = null
  try {
    model = await nsfw.load()
  } catch (error) {
    console.log(error)
  }

  while (true) {
    let stickerSet = await db.collections.StickerSet.findOne({
      public: true,
      moderated: { $ne: true },
    }).sort({
      publishDate: -1
    })

    if (!stickerSet) {
      stickerSet = await db.collections.StickerSet.findOne({
        public: true,
        moderated: true,
        publishDate: {
          $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
        },
      }).sort({
        publishDate: 1
      })

      if (stickerSet) {
        const dateNow = new Date()

        const todayAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: dateNow,
          },
          'metadata.type': 'add',
          'metadata.stickerSet': stickerSet,
        })

        const weekAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: new Date(dateNow.getTime() - 604800000), // 7 days
          },
          'metadata.type': 'add',
          'metadata.stickerSet': stickerSet,
        })

        const monthAddCount = await db.collections.Metric.countDocuments({
          timestamp: {
            $gte: new Date(dateNow.getTime() - 2592000000), // 30 days
          },
          'metadata.type': 'add',
          'metadata.stickerSet': stickerSet,
        })

        const totalAddCount = await db.collections.Metric.countDocuments({
          'metadata.type': 'add',
          'metadata.stickerSet': stickerSet,
        })

        stickerSet.installations.day = todayAddCount
        stickerSet.installations.week = weekAddCount
        stickerSet.installations.month = monthAddCount
        stickerSet.installations.total = totalAddCount
      }
    }

    if (!stickerSet) {
      console.log('No sticker sets to check')
      await new Promise(resolve => setTimeout(resolve, 1000 * 10))
      continue
    }

    const stickerSetInfo = await telegram.getStickerSet(stickerSet.name).catch(error => {
      return {
        error
      }
    })

    if (stickerSetInfo.error) {
      console.log('Error getting sticker set info', stickerSetInfo.error)

      if (stickerSetInfo.error.code === 400) {
        stickerSet.public = false
      }
      await stickerSet.save()

      continue
    }

    console.log(`Checking ${stickerSet.title} — https://t.me/addstickers/${stickerSet.name}`)

    console.time('nsfwCheck')
    const nsfwCheckResults = (await promiseAllChunked(stickerSetInfo.stickers.map(async sticker => {
      const fileInfo = await getFile(sticker?.thumb?.file_id || sticker?.file_id).catch(() => null)

      if (!fileInfo || !fileInfo.link) return

      return nsfwCheck(model, fileInfo.link).catch(() => null)
    }), 5)).filter(result => result)
    console.timeEnd('nsfwCheck')

    let nsfwCounts = 0
    let highNsfwCounts = 0

    nsfwCheckResults.forEach(result => {
      if (result['Porn'] >= 70 || result['Hentai'] >= 70 || result['Sexy'] >= 75) {
        nsfwCounts += 1
      }
      if (result['Porn'] >= 90 || result['Hentai'] >= 90 || result['Sexy'] >= 95) {
        highNsfwCounts += 1
      }
    })

    const nsfwCheckResultsAverage = nsfwCheckResults.reduce((acc, result) => {
      Object.keys(result).forEach(key => {
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key] = acc[key] + result[key]
      })
      return acc
    }, {})

    Object.keys(nsfwCheckResultsAverage).forEach(key => {
      nsfwCheckResultsAverage[key] = nsfwCheckResultsAverage[key] / nsfwCheckResults.length
    })

    console.log(
      'average:', nsfwCheckResultsAverage,
      'nsfwCounts:', nsfwCounts,
      'highNsfwCounts:', highNsfwCounts,
      'procent:', (nsfwCounts / nsfwCheckResults.length) * 100
    )

    stickerSet.moderated = true
    stickerSet.publishDate = new Date()

    if (
      (nsfwCounts / nsfwCheckResults.length) * 100 >= 10 ||
      highNsfwCounts >= 1 ||
      nsfwCheckResultsAverage['Porn'] >= 70 || nsfwCheckResultsAverage['Hentai'] >= 70 || nsfwCheckResultsAverage['Sexy'] >= 75
    ) {
      stickerSet.about.safe = false
      console.log('nsfw', stickerSet.id.toString())
    } else {
      stickerSet.about.safe = true
    }

    const atlasStickerSet = await db.atlasCollections.StickerSet.findOne({
      _id: stickerSet._id,
    })

    if (atlasStickerSet) {
      if (atlasStickerSet.about.safe !== true) {
        stickerSet.about.safe = false
      }
      if (atlasStickerSet.public !== true) {
        stickerSet.public = false
      }
    }

    await stickerSet.save()

    await db.atlasCollections.StickerSet.findOneAndUpdate({
      _id: stickerSet._id,
    }, {
      $set: stickerSet,
    }, {
      upsert: true,
      new: true,
    })
  }
})()
