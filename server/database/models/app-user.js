const mongoose = require('mongoose')

const schema = mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  moderator: {
    type: Boolean,
    default: false,
  },
  client: {
    country: String,
    platform: String,
    browser: String,
    version: String,
    os: String,
  },
}, {
  timestamps: true,
})

schema.index({
  provider: 1,
  uid: 1,
}, {
  unique: true,
})

module.exports = schema
