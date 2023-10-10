const got = require('got')
const Redis = require('ioredis')

const redis = Redis.createClient({
  prefix: `${process.env.REDIS_PREFIX}:admitad:`,
})

const { ADMITAD_CLIENT_ID, ADMITAD_CLIENT_SECRET } = process.env
const ADMITAD_API_URL = 'https://api.admitad.com/'
const SCOPE = 'aliexpress_commission validate_links'

const instance = got.extend({
  prefixUrl: ADMITAD_API_URL,
  timeout: 2000,
  throwHttpErrors: false,
  responseType: 'json',
})

async function getToken () {
  const data = ADMITAD_CLIENT_ID + ':' + ADMITAD_CLIENT_SECRET
  const result = await instance.post('token/?grant_type=client_credentials&client_id=' + ADMITAD_CLIENT_ID + '&scope=' + SCOPE, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(data).toString('base64'),
    },
  })
  if (result.error_description) {
    console.error(result.error_description)
    return false
  }
  return result.body.access_token
}

async function admitadRequest (url, methodType, params) {
  let token = await redis.get('token')

  if (!token) {
    token = await getToken()
    redis.set('token', token, 'EX', 60 * 60)
  }

  return instance(url, {
    method: methodType,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: params,
  })
}

async function aliCommissionRates (urls) {
  const result = await admitadRequest(
    'aliexpress/commission_rates/',
    'POST',
    {
      urls,
    },
  )

  return result.body
}

async function validateLink (link, id) {
  const result = await admitadRequest(
    'validate_links/?link=' + encodeURIComponent(link),
    'GET',
  )

  return {
    body: result.body,
    id,
  }
}

module.exports = {
  aliCommissionRates,
  validateLink,
}
