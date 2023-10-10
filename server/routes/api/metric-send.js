const {
  sendMetric,
} = require('../../utils/')

const METRIC_TYPES = [
  'add',
  'react',
  'view',
]

module.exports = async (ctx) => {
  const { type, value, stickerSetId } = ctx.props

  ctx.assert(type, 400, 'Bad Request: TYPE_REQUIRED')
  ctx.assert(METRIC_TYPES.includes(type), 400, 'Bad Request: TYPE_INVALID')

  const result = await sendMetric(ctx.state.user, type, value, stickerSetId)

  if (result.ok) {
    ctx.result = 'OK'
  } else {
    ctx.result = 'ERROR'
  }
}
