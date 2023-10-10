const {
  getFile,
} = require('../utils')

module.exports = async (ctx) => {
  const { fileId, ex } = ctx.params

  ctx.assert(fileId, 400, 'fileId empty')

  const file = await getFile(fileId)

  if (file.error) {
    ctx.throw(400, 'Bad Request: Telegram error', {
      description: file.error.description,
    })
  }

  if (ex) {
    if (ex.endsWith('webp')) {
      ctx.response.set('content-type', 'image/webp')
    }
  }

  ctx.body = file.file
}
