const crypto = require('crypto')
const got = require('got')
const GOOGLE_AD_KEY_URL = 'https://gstatic.com/admob/reward/verifier-keys.json'

/**
 * Fetches the google public keys for the admob providers.
 * These keys changes time to time.
 */
const getGoogleKeysMap = async () => {
  const googleKeyRes = await got(GOOGLE_AD_KEY_URL)
  const { keys } = JSON.parse(googleKeyRes.body)
  if (!keys) {
    throw new Error('No keys found from google keys')
  }
  /** For each of the keys array save it base 64 in decoded form in the key map */
  const keyMap = {}
  keys.forEach(k => {
    keyMap[`${k.keyId}`] = crypto.createPublicKey(k.pem)
  })
  return keyMap
}

/**
 * Verifies the callback url query params string,
 * Resolves the promise if verification was successful, else fails.
 * Wanna 'debug' then pass the second parameter as true.
 * @param {String} queryUrl
 * @param {String} signature
 * @param {String} keyId
 * @param {Boolean} debug
 */
async function verify (queryUrl, signature, keyId, debug) {
  if (typeof queryUrl !== 'string') throw new TypeError('URL needs to be string!')

  /**
   * Request coming as callback from admob must contain the 'signature' and the 'user_id'.
   * For more info https://developers.google.com/admob/android/rewarded-video-ssv
   */
  if (!signature) {
    throw new Error('No signature value exist in the URL param')
  }

  if (debug) {
    console.debug('Signature and KeyId ---')
    console.debug(signature, keyId)
  }

  let queryParamsString = queryUrl
  if (queryParamsString.indexOf('?') > -1) {
    queryParamsString = queryUrl.split('?')[1]
  }

  if (debug) {
    console.debug('Query param string ---')
    console.debug(queryParamsString)
  }

  /**
   * As per admob,
   * The last two query parameters of rewarded video SSV callbacks are always signature and key_id, in that order.
   * The remaining query parameters specify the content to be verified.
   */
  const contentToVerify = queryParamsString.substring(0, queryParamsString.indexOf('signature') - 1)

  if (debug) {
    console.debug('Content to verify ---')
    console.debug(contentToVerify)
  }

  const keyMap = await getGoogleKeysMap()

  if (keyMap[`${keyId}`]) {
    const publicKey = keyMap[`${keyId}`]
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(contentToVerify)
    const result = verifier.verify(publicKey, signature, 'base64')
    if (result) {
      return true
    } else {
      throw new Error('Invalid Signature Supplied')
    }
  } else {
    throw new Error('Key id provided doesn\'t exist in the google public keys')
  }
};

module.exports.verify = verify
