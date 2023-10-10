const crypto = require('crypto')
const querystring = require('qs')

const varifyTelegramWebAppData = (telegramInitData) => {
  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(telegramInitData)

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.BOT_TOKEN)

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split('&')
  const hashIndex = arr.findIndex(str => str.startsWith('hash='))
  const hash = arr.splice(hashIndex)[0].split('=')[1]
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b))
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join('\n')

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac('sha256', secret.digest())
    .update(dataCheckString)
    .digest('hex')

  // if hash are equal the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  return _hash === hash
}

function varifyTelegramLoginData ({ hash, ...data }) {
  const secret = crypto.createHash('sha256')
    .update(process.env.BOT_TOKEN)
    .digest()
  const checkString = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join('\n')
  const hmac = crypto.createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')
  return hmac === hash
}

module.exports = async (ctx) => {
  if (
    process.env.NODE_ENV !== 'development' &&
    !varifyTelegramLoginData(querystring.parse(ctx.props.initData)) &&
    !varifyTelegramWebAppData(ctx.props.initData)
  ) {
    ctx.throw(400, 'Bad Request: HASH_INVALID')
  }

  const initData = querystring.parse(ctx.props.initData)

  if (!initData.auth_date) {
    ctx.throw(400, 'Bad Request: AUTH_DATE_INVALID')
  }

  const authDate = new Date(initData.auth_date * 1000)

  if (
    process.env.NODE_ENV !== 'development' &&
    authDate.getTime() < Date.now() - 1000 * 60 * 5 // 5 minutes
  ) {
    ctx.throw(400, 'Bad Request: AUTH_DATE_INVALID')
  }

  let userData

  if (initData.user) {
    userData = JSON.parse(initData.user)
  } else if (initData.first_name) {
    userData = {
      id: initData.id,
      first_name: initData.first_name,
      last_name: initData.last_name,
      username: initData.username,
      photo_url: initData.photo_url,
    }
  }

  if (!userData) {
    ctx.throw(400, 'Bad Request: USER_MISSING')
  }

  const userToken = crypto.randomBytes(16).toString('hex')

  ctx.state.redis.set(
    `user:${userToken}`,
    userData.id,
    'EX',
    60 * 60 * 24,
  )

  const userDB = await ctx.state.db.User.findOne({
    telegram_id: userData.id,
  })

  ctx.result = {
    user_token: userToken,
    isModerator: userDB?.moderator || false,
  }
}
