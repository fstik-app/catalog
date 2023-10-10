const Crawler = require('crawler')
const mongoose = require('mongoose')
const db = require('../database')

const c = new Crawler({
  maxConnections: 10,
})

const domain = 'https://stickers.wiki'

function normalizeTags (tags) {
  return tags.map(tag => {
    if (tag === '') {
      return null
    }

    return tag.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('')
  })
}

function parseStickersWiki (url) {
  c.queue({
    uri: url,
    callback: function (error, res, done) {
      if (error) {
        console.log(error)
      } else {
        const $ = res.$
        const stickers = $('.stickerpack_card')

        stickers.each((i, sticker) => {
          const href = $(sticker).attr('href')

          c.queue({
            uri: domain + href,
            callback: async (error, res, done) => {
              if (error) {
                console.log(error)
              } else {
                const $ = res.$
                const stickerPack = $('.stickerpack_intro')

                const title = stickerPack.find('h1').text()
                const accent = stickerPack.find('.accent').attr('href')
                const suggestions = $('.stickerpack_definition').find('a')

                const tags = []

                suggestions.each((i, suggestion) => {
                  const href = $(suggestion).attr('href')
                  const text = $(suggestion).text()

                  if (href.includes('/ru/telegram/search/?q=')) {
                    if (text && text.length > 1) tags.push(text)
                  }
                })

                const normalizedTags = tags ? normalizeTags(tags) : []

                const stickerSetName = accent.split('/').pop()

                console.log(title, stickerSetName, normalizedTags)

                let stickerSet = await db.collections.StickerSet.findOne({
                  name: stickerSetName,
                })

                if (!stickerSet) {
                  stickerSet = new db.collections.StickerSet({
                    _id: mongoose.Types.ObjectId(),
                    owner: '5e9427c32c59000709e09c86',
                    name: stickerSetName,
                    title,
                    animated: false,
                    video: false,
                    create: false,
                    thirdParty: true,
                  })
                }

                if (!stickerSet.about.description) {
                  stickerSet.about.description = tags.join(', ') + '\n\n' + normalizedTags.map(tag => `#${tag}`).join(' ') + '\n\nStickers from Stickers.Wiki'
                  stickerSet.about.tags = normalizedTags
                  stickerSet.about.safe = true
                }

                stickerSet.public = true

                console.log(stickerSet.id.toString())

                await stickerSet.save()
              }
              done()
            },
          })
        })
      }
      done()
    },
  })
}

(async () => {
  // for (let i = 0; i < 50; i++) {
  //   parseStickersWiki(`${domain}/ru/telegram/catalog/static/${i}`)
  // }
})()
