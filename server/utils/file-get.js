const got = require('got')
const { Telegram } = require('telegraf')
const Redis = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: `${process.env.REDIS_PREFIX}:file:`,
})

const tg = new Telegram(process.env.BOT_TOKEN)

const streamToBase64 = (stream) => {
  return new Promise((resolve, reject) => {
    const buffers = []
    stream.on('data', (chunk) => { buffers.push(chunk) })
    stream.once('end', () => {
      const buffer = Buffer.concat(buffers)
      resolve(buffer.toString('base64'))
    })
    stream.once('error', (err) => {
      reject(err)
    })
  })
}

module.exports = async (fileId) => {
  const fileInfoKey = `info:${fileId}`

  const fileInfo = JSON.parse(await redis.get(fileInfoKey)) || await tg.getFile(fileId).then(result => {
    redis.set(
      fileInfoKey,
      JSON.stringify(result),
      'EX',
      60 * 60, // 1 hour
    )

    return result
  }).catch(() => null)

  if (!fileInfo) return { error: true }

  const fileDataKey = `data:${fileInfo.file_unique_id}`

  const fileCache = await redis.get(fileDataKey)

  if (fileCache) {
    redis.set(
      fileDataKey,
      fileCache,
      'EX',
      60 * 30, // 30 minutes
    )

    return {
      file: Buffer.from(fileCache, 'base64'),
      fileInfo,
    }
  }

  const link = await tg.getFileLink(fileInfo)

  if (!link) return { error: true }

  const fileStream = got.stream(link)

  streamToBase64(fileStream).then((base64) => {
    redis.set(
      fileDataKey,
      base64,
      'EX',
      60 * 15, // 15 minutes
    )
  }).catch((error) => {
    redis.del(fileDataKey)
    redis.del(fileInfoKey)

    return { error }
  })

  return {
    file: fileStream,
    fileInfo,
  }
}
