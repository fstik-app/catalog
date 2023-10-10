const db = require('../database')

// ;(async () => {
//   const stickerSets = await db.collections.StickerSet.find({
//     public: true,
//   }).cursor()

//   for (let stickerSet = await stickerSets.next(); stickerSet != null; stickerSet = await stickerSets.next()) {
//     // find or update in atlas
//     db.atlasCollections.StickerSet.findOneAndUpdate({
//       _id: stickerSet._id,
//     }, {
//       $set: stickerSet,
//     }, {
//       upsert: true,
//       new: true,
//     }).then((doc) => {
//       console.log(true)
//     }).catch((err) => {
//       console.log(err)
//     })
//   }

//   console.log('done')
// })()
