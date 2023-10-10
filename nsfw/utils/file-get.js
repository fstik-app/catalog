const { Telegram } = require('telegraf')

const tg = new Telegram(process.env.BOT_TOKEN)

module.exports = async (fileId) => {
  const fileInfo = await tg.getFile(fileId).catch(() => null)

  if (!fileInfo) return { error: true }

  const link = await tg.getFileLink(fileInfo)

  if (!link) return { error: true }

  return {
    fileInfo,
    link
  }
}
