const { verify: verifySSV } = require('../../lib/admob-rewarded-ads-ssv')
const { verifyToken } = require('../../services/firebase')

module.exports = async (ctx) => {
  const { custom_data: customData, ...rewardedData } = ctx.props

  await verifySSV(
    ctx.url,
    rewardedData.signature,
    rewardedData.key_id,
    process.env.NODE_ENV === 'development',
  )
  const decodedToken = await verifyToken(customData)

  console.log(rewardedData)
  console.log(decodedToken)

  // TODO: save rewardedData with user

  ctx.result = true
}
