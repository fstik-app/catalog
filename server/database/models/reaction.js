const mongoose = require('mongoose')

const reactionSchema = mongoose.Schema({
  stickerSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StickerSet',
    index: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  reaction: {
    type: Number,
    required: true,
    enum: [-1, 1],
    default: null,
    index: true,
  },
})

module.exports = reactionSchema
