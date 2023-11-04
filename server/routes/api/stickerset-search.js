const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const db = require('../../database')
const {
  sendMetric,
  stickerSetInfo,
  getReaction,
  getUserReaction,
} = require('../../utils/')

const REDIS_PREFIX = 'stickerSet'

function randomWithSeed (seed) {
  const hash = crypto.createHash('sha256')
  hash.update(seed.toString())
  const value = hash.digest('hex')
  return parseInt(value.substring(0, 8), 16)
}

async function addReactions (stickerSets, user, recount) {
  const result = []

  if (stickerSets[0] && !stickerSets[0].reaction) {
    recount = true
  }

  const reactionsPromises = stickerSets.map(async (stickerSet, index) => {
    if (stickerSet) {
      const reaction = {}

      if (recount) {
        const totalReaction = await getReaction(stickerSet.id)

        reaction.like = totalReaction.like
        reaction.dislike = totalReaction.dislike
      } else {
        reaction.like = stickerSet.reaction.like
        reaction.dislike = stickerSet.reaction.dislike
      }

      reaction.current = await getUserReaction(stickerSet.id, user)

      result[index] = {
        ...stickerSet,
        reaction,
      }
    } else {
      result[index] = null
    }
  })

  await Promise.all(reactionsPromises)

  return result
}

async function searchStickerSet (query, sort, matchQuery, pagination) {
  let searchTag = false

  if (query.indexOf('#') === 0) {
    sort = [
      {
        $sort: {
          'reaction.total': -1,
        },
      },
    ]

    query = `"${query}"`
    searchTag = true
  }

  const searchCoompound = [
    {
      text: {
        query,
        path: ['title', 'name', 'about.description', 'about.tags'],
        score: {
          function: {
            add: [
              {
                score: 'relevance',
              },
              {
                multiply: [
                  {
                    path: {
                      value: 'reaction.total',
                    },
                  },
                  { constant: 0.2 },
                ],
              },
            ],
          },
        },
      },
    },
    {
      text: {
        query,
        path: ['title', 'name', 'about.description', 'about.tags'],
        score: {
          function: {
            add: [
              {
                score: 'relevance',
              },
              {
                multiply: [
                  {
                    path: {
                      value: 'reaction.total',
                    },
                  },
                  { constant: 0.01 },
                ],
              },
            ],
          },
        },
        fuzzy: {
          maxEdits: 2,
          maxExpansions: 10,
        },
      },
    },
  ]

  const querySplit = query.split(' ')
  if (querySplit.length > 1 && querySplit[1].length > 1) {
    searchCoompound.unshift({
      phrase: {
        query,
        path: [
          'title',
          'name',
          'about.description',
          'about.tags',
        ],
        score: {
          function: {
            add: [
              { constant: 1000 },
              {
                score: 'relevance',
              },
              {
                path: {
                  value: 'reaction.total',
                },
              },
            ],
          },
        },
        slop: 2,
      },
    })
  }

  return (await db.atlasCollections.StickerSet.aggregate([
    {
      $search: {
        compound: {
          should: searchTag
            ? {
                text: {
                  query,
                  path: [
                    'about.tags',
                  ],
                },
              }
            : searchCoompound,
        },
      },
    },
    {
      $match: {
        ...matchQuery,
      },
    },
    ...sort,
    pagination,
  ]))[0]
}

async function moreLikeThis (query, matchQuery, pagination, findPublicQuery) {
  if (!query || !Array.isArray(query)) {
    throw new Error('query must be array')
  }

  query = query.filter((id) => {
    return mongoose.Types.ObjectId.isValid(id)
  })

  const likeThis = await db.collections.StickerSet.find({
    _id: { $in: query },
    public: findPublicQuery,
  }).limit(10).lean()

  if (likeThis.length <= 0) {
    return {
      stickerSets: [],
    }
  }

  likeThis.forEach((stickerSet) => {
    // delete end "stickes from ..."
    if (stickerSet.about && stickerSet.about.description) {
      stickerSet.about.description = stickerSet.about.description.replace(/(Stickers from .*)/gi, '')
    }
    // delete "@fStikBot from title"
    if (stickerSet.title) {
      stickerSet.title = stickerSet.title.replace('by @fStikBot', '')
      stickerSet.title = stickerSet.title.replace(':: @fStikBot', '')
      stickerSet.title = stickerSet.title.replace(/(@fStikBot)/gi, '')
    }
  })

  return (await db.atlasCollections.StickerSet.aggregate([
    {
      $search: {
        moreLikeThis: {
          like: likeThis,
        },
      },
    },
    {
      $match: {
        ...matchQuery,
      },
    },
    {
      $limit: 500,
    },
    pagination,
  ]))[0]
}

async function likeStickerSet (user, matchQuery, pagination, findPublicQuery) {
  const lastLikes = await db.collections.Metric.aggregate([
    {
      $match: {
        'metadata.type': 'react',
        'metadata.value': 'like',
        'metadata.user': user._id,
        ...matchQuery,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 100,
    },
  ])

  if (lastLikes.length <= 0) {
    return {
      stickerSets: [],
      totalCount: [{
        count: 0,
      }],
    }
  }

  const lastLikesIds = lastLikes.map((like) => {
    return like.metadata.stickerSet
  })

  if (lastLikesIds.length > 0) {
    lastLikesIds.sort(() => Math.random() - 0.5)
    lastLikesIds.splice(5)

    const lastLikesStickerSets = await db.atlasCollections.StickerSet.find({
      _id: {
        $in: lastLikesIds,
      },
      public: findPublicQuery,
    }).lean()

    if (lastLikesStickerSets.length > 0) {
      return (await db.atlasCollections.StickerSet.aggregate([
        {
          $search: {
            moreLikeThis: {
              like: lastLikesStickerSets,
            },
          },
        },
        {
          $limit: 100,
        },
        {
          $match: {
            _id: {
              $nin: lastLikesIds,
            },
            'reaction.total': {
              $gt: 5,
            },
            ...matchQuery,
          },
        },
        pagination,
      ]))[0]
    }
  }
}

async function verifiedStickerSet (matchQuery, skip, limit) {
  let searchResult = {
    stickerSets: [],
  }

  const stickerSets = await db.atlasCollections.StickerSet.aggregate([
    {
      $match: {
        $or: [
          {
            'about.verified': true,
          },
          {
            'about.safe': true,
            public: true,
            'reaction.total': {
              $gt: 50,
            },
          },
        ],
        ...matchQuery,
      },
    },
  ])

  searchResult = {
    stickerSets: {},
    totalCount: [
      {
        count: stickerSets.length,
      },
    ],
  }

  searchResult.stickerSets = stickerSets.sort((a, b) => {
    const minutes = Math.floor(new Date().getMinutes() / 6)
    const time = new Date().setMinutes(minutes, 0, 0)

    const aId = a._id.toString('hex')
    const bId = b._id.toString('hex')

    return randomWithSeed(time + aId) - randomWithSeed(time + bId)
  }).slice(skip, skip + limit)

  return searchResult
}

async function popularStickerSet (matchQuery, pagination) {
  return (await db.atlasCollections.StickerSet.aggregate([
    {
      $match: {
        ...matchQuery,
      },
    },
    {
      $lookup: {
        from: 'metrics',
        localField: '_id',
        foreignField: 'metadata.stickerSet',
        as: 'metrics',
      },
    },
    {
      $match: {
        'metrics.metadata.type': 'add',
      },
    },
    {
      $addFields: {
        adds: { $size: '$metrics' },
      },
    },
    {
      $sort: {
        adds: -1,
      },
    },
    pagination,
  ]))[0]
}

async function trendingStickerSet (matchQuery, pagination) {
  return (await db.atlasCollections.StickerSet.aggregate([
    {
      $addFields: {
        installDay: { $multiply: ['$installations.day', 1.5] },
        installWeek: { $multiply: ['$installations.week', 1.2] },
      },
    },
    {
      $sort: {
        installDay: -1,
        installWeek: -1,
        'installations.month': -1,
      },
    },
    {
      $match: {
        'reaction.total': {
          $gt: 5,
        },
        ...matchQuery,
      },
    },
    pagination,
  ]).sort({
    publishDate: -1,
  }))[0]
}

async function newStickerSet (matchQuery, pagination) {
  return (await db.atlasCollections.StickerSet.aggregate([
    {
      $match: {
        ...matchQuery,
        'reaction.total': {
          $gt: -10,
        },
      },
    },
    {
      $sort: {
        publishDate: -1,
      },
    },
    pagination,
  ]))[0]
}

async function getStickerSet (query = '', kind = 'regular', type = '', skip = 0, limit = 25, findPublic, findSafe, user) {
  const findPublicQuery = findPublic !== false

  const matchQuery = {
    public: findPublicQuery,
    packType: kind,
  }

  if (findSafe === true) {
    matchQuery['about.safe'] = findSafe
  }

  let searchResult = {
    stickerSets: [],
    totalCount: [{
      count: 0,
    }],
  }

  const sort = []

  const pagination = {
    $facet: {
      stickerSets: [
        { $skip: skip }, { $limit: limit },
      ],
      totalCount: [
        {
          $count: 'count',
        },
      ],
    },
  }

  if (query && !Array.isArray(query) && query.length > 0) {
    searchResult = await searchStickerSet(query, sort, matchQuery, pagination)
  } else if (type === 'more') {
    if (!Array.isArray(query) || query.length <= 0) {
      throw new Error('query must be array')
    }

    searchResult = await moreLikeThis(query, matchQuery, pagination, findPublicQuery)

    // filter query not like this
    searchResult.stickerSets = searchResult.stickerSets.filter((stickerSet) => {
      return !query.includes(stickerSet._id.toString())
    })
  } else if (user && user._id && type === 'liked') {
    searchResult = await likeStickerSet(user, matchQuery, pagination, findPublicQuery)
  } else if (type === 'verified') {
    searchResult = await verifiedStickerSet(matchQuery, skip, limit)
  } else if (type === 'trending') {
    searchResult = await trendingStickerSet(matchQuery, pagination)
  } else if (type === 'popular') {
    searchResult = await popularStickerSet(matchQuery, pagination)
  } else {
    searchResult = await newStickerSet(matchQuery, pagination)
  }

  const stickerSets = searchResult.stickerSets
  const totalCount = searchResult.totalCount[0] ? searchResult.totalCount[0].count : 0

  const stickerSetsPromises = stickerSets.map(async (stickerSet, index) => {
    const info = await stickerSetInfo(stickerSet)
    stickerSets[index] = info
  })

  await Promise.all(stickerSetsPromises)

  return {
    stickerSets,
    totalCount,
  }
}

async function filterStickerSets (stickerSets, isPublic, isSafe) {
  return stickerSets.filter(stickerSet => {
    if (!stickerSet) {
      return false
    }

    if (isPublic !== null && stickerSet.public !== isPublic) {
      return false
    }

    if (isSafe !== null && stickerSet.safe !== isSafe) {
      return false
    }

    const reactionSum = stickerSet.reaction.like + stickerSet.reaction.dislike

    if (
      stickerSet.stickers.length > 5 &&
      reactionSum > -10
    ) {
      return true
    }

    return false
  })
}

function stopWords (searchQuery) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../stopwords.txt'), 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }

      const stopWords = data.split('\n')
      stopWords.splice(stopWords.indexOf(''), 1)

      const regex = new RegExp(`(${stopWords.join('|')})`, 'gi')

      resolve(regex.test(searchQuery))
    })
  })
}

module.exports = async (ctx) => {
  if (!ctx.props.safe && ctx.state.user.moderator) {
    ctx.props.safe = false
  }

  const { user_token, ...props } = ctx.props
  const { query, kind, type } = props

  if (type === 'verified') {
    props.user = ctx.state?.user?._id?.toString()
  }

  ctx.assert(!(await stopWords(query)), 400, 'Bad Request: query contains stop words')

  const findPublic = typeof ctx.props.public !== 'undefined' ? ctx.props.public === 'true' : null
  const findSafe = typeof ctx.props.safe !== 'undefined' ? ctx.props.safe === 'true' : true

  let limit = parseInt(ctx.props.limit) || 25
  if (limit <= 0) limit = 25
  if (limit > 100) limit = 50

  let skip = parseInt(ctx.props.skip) || 0
  if (skip < 0) skip = 0

  const hash = crypto.createHash('sha256')
  hash.update(JSON.stringify(props))

  const keyQueryCache = `${REDIS_PREFIX}:query:${hash.digest('hex')}`

  const cacheQueryStickerSet = JSON.parse(
    await ctx.state.redis.get(keyQueryCache),
  )

  let result = null

  if (cacheQueryStickerSet) {
    result = cacheQueryStickerSet

    const stickerSetsPromises = result.stickerSets.map(async (stickerSetId, index) => {
      if (!stickerSetId) {
        result.stickerSets[index] = null
      }

      let stickerSet

      const stickerSetRedis = await ctx.state.redis.get(`${REDIS_PREFIX}:id:${stickerSetId}`)

      if (stickerSetRedis) {
        stickerSet = JSON.parse(stickerSetRedis)
      } else {
        const stickerSetDB = await db.atlasCollections.StickerSet.findById(stickerSetId)

        if (stickerSetDB) {
          stickerSet = await stickerSetInfo(stickerSetDB)
        }
      }

      result.stickerSets[index] = stickerSet
    })

    await Promise.all(stickerSetsPromises)

    result.stickerSets = await addReactions(result.stickerSets, ctx.state.user, true)
  } else {
    const consoleLogName = `stickerSet ${crypto.randomBytes(8).toString('hex')}`

    console.time(consoleLogName)
    result = await getStickerSet(query, kind, type, skip, limit, findPublic, findSafe, ctx.state.user)
    console.timeEnd(consoleLogName)

    if (result.stickerSets.length <= 0) {
      ctx.result = {
        stickerSets: [],
        totalCount: 0,
      }
      return
    }

    const cacheQueryStickerSet = JSON.stringify({
      stickerSets: result.stickerSets.map(stickerSet => {
        if (stickerSet?.id) {
          return stickerSet.id
        }
      }),
      totalCount: result.totalCount,
    })

    ctx.state.redis.set(keyQueryCache, cacheQueryStickerSet, 'EX', 60 * 15)

    result.stickerSets = await addReactions(result.stickerSets, ctx.state.user)
  }

  result.count = result.stickerSets.length

  if (!ctx.state.user.moderator) {
    result.stickerSets = await filterStickerSets(result.stickerSets, findPublic, findSafe)
  } else {
    result.stickerSets = result.stickerSets.filter(stickerSet => {
      if (stickerSet) return true
    })
  }

  // result.forEach(async stickerSet => {
  //   if (stickerSet) {
  //     sendMetric(ctx.state.user, 'view', 'feed', stickerSet.id)
  //   }
  // })

  ctx.result = result
}
