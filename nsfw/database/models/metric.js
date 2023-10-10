const mongoose = require('mongoose')

const metricSchema = mongoose.Schema({
  metadata: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    stickerSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StickerSet',
      index: true
    },
    type: {
      type: String,
      index: true,
      required: true
    },
    value: {
      type: String,
      maxLength: 50
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  }
})

module.exports = metricSchema
