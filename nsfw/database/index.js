const collections = require('./models')
const {
  connection,
  atlasConnection
} = require('./connection')

module.exports = {
  connection,
  atlasConnection,
  collections: {
    StickerSet: connection.model('stickerSets', collections.StickerSet),
    Metric: connection.model('metrics', collections.Metric)
  },
  atlasCollections: {
    StickerSet: atlasConnection.model('stickerSets', collections.StickerSet)
  }
}
