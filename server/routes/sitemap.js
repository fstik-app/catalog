const { toXML } = require('jstoxml')

const LIMIT = 1000

module.exports = async (ctx) => {
  const type = ctx.captures[0]
  const offset = parseInt(ctx.captures[1], 10)

  let stickerSets = []

  if (type === 'verified') {
    stickerSets = await ctx.state.atlas.StickerSet.find({
      public: true,
      'about.verified': true,
      'about.safe': true,
    }).limit(LIMIT)
  } else if (type === 'popular') {
    stickerSets = await ctx.state.atlas.StickerSet.find({
      public: true,
      'about.safe': true,
    }).sort({
      'rating.score': -1,
    }).limit(LIMIT)
  } else if (type === 'new') {
    stickerSets = await ctx.state.atlas.StickerSet.find({
      public: true,
      'about.safe': true,
    }).sort({
      publishedAt: -1,
    }).limit(LIMIT)
  } else if (type === 'total') {
    stickerSets = await ctx.state.atlas.StickerSet.find({
      public: true,
      'about.safe': true,
    }).sort({
      createdAt: 1,
    }).limit(LIMIT).skip(offset).limit(LIMIT)
  } else {
    const total = await ctx.state.atlas.StickerSet.countDocuments({
      public: true,
      'about.safe': true,
    })

    ctx.response.set('content-type', 'application/xml')
    ctx.body = toXML({
      _name: 'sitemapindex',
      _attrs: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      _content: Array.from(Array(Math.ceil(total / LIMIT)).keys()).map((i) => ({
        _name: 'sitemap',
        _content: {
          _name: 'loc',
          _content: `https://${ctx.request.host}/sitemap/total.${i}.xml`,
        },
      })),
    })

    return
  }

  const sitemap = toXML([
    {
      _name: 'urlset',
      _attrs: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      _content: stickerSets.map((stickerSet) => ({
        _name: 'url',
        _content: [
          {
            _name: 'loc',
            _content: `${process.env.DOMAIN}/stickerSet/${stickerSet.name}`,
          },
          {
            _name: 'lastmod',
            _content: stickerSet.updatedAt.toISOString(),
          },
        ],
      })),
    },
  ])

  ctx.response.set('content-type', 'application/xml')
  ctx.body = sitemap
}
