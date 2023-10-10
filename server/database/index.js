const collections = require('./models')
const {
  connection,
  atlasConnection,
} = require('./connection')

module.exports = {
  connection,
  atlasConnection,
  collections: {
    User: connection.model('user', collections.User),
    AppUser: connection.model('appUser', collections.AppUser),
    StickerSet: connection.model('stickerSets', collections.StickerSet),
    Reaction: connection.model('reaction', collections.Reaction),
    Metric: connection.model('metric', collections.Metric),
  },
  atlasCollections: {
    StickerSet: atlasConnection.model('stickerSets', collections.StickerSet),
  },
}
