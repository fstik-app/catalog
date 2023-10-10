const got = require('got')
const {
  aliCommissionRates,
  validateLink,
} = require('./admitad')

const domain = 'https://m.aliexpress.com'

const ALI_DOMAIN = {
  WW: 'https://aliexpress.com',
  CIS: 'https://aliexpress.ru',
}
const ALI_REF_PREFIX = {
  WW: 'https://alitems.co/g/1e8d114494386c820c1016525dc3e8/?subid=banner&ulp=',
  CIS: 'https://alitems.co/g/vv3q4oey1v386c820c10b6d1781017/?subid=banner&ulp=',
}

const locales = {
  RU: 'ru_RU',
  EN: 'en_US',
  UA: 'uk_UA',
  ID: 'id_ID',
}

const currencies = {
  RU: 'RUB',
  EN: 'USD',
  UA: 'UAH',
  ID: 'IDR',
}

function parseAliexpress (query, region, country) {
  let locale = locales[country] || 'en_US'

  if (region === 'CIS') {
    locale = 'ru_RU'
  }

  return got.get(`${domain}/api/search/main/items`, {
    headers: {
      Referer: 'https://m.aliexpress.com/',
      'Content-Type': 'multipart/form-data; charset=utf-8;',
      Cookie: `aep_usuc_f=site=glo&x_alimid=734939910&region=${country || 'DE'}&b_locale=${locale}&c_tp=${currencies[country] || 'USD'};`,
    },
    searchParams: {
      appId: 18539,
      params: JSON.stringify({
        clientType: 'msite',
        searchBizScene: 'mainSearch',
        page: Math.floor(Math.random() * 5) + 1,
        pageSize: 20,
        refine_conf: 0,
        osf: 'direct',
        q: query,
        style: 'list',
      }),
    },
    responseType: 'json',
  }).then(result => {
    const content = result.body?.data?.searchResult?.mods?.itemList?.content

    if (content && content.length > 0) {
      return content.map(product => {
        if (product.productId) {
          let originalPrice
          if (product.prices?.originalPrice) {
            originalPrice = product.prices.originalPrice?.formattedPrice
          }
          return {
            id: product.productId,
            title: product.title.seoTitle,
            link: `${ALI_DOMAIN[region]}/item/${product.productId}.html`,
            image: product.image.imgUrl,
            originalPrice,
            price: product.prices.salePrice.formattedPrice,
          }
        }
        return null
      })
    }

    return []
  })
}

async function search (query, country = 'GB') {
  let region = 'WW'

  // CIS countries
  if (['RU', 'BY', 'KZ', 'KG', 'MD', 'TJ', 'TM', 'UZ', 'AZ', 'AM'].includes(country)) {
    region = 'CIS'
  }

  for (let i = 0; i < 3; i++) {
    let products = await parseAliexpress(query, region, country)
    if (products.length) {
      products = products.filter(product => product)

      // const validIds = []
      // const validLinks = await Promise.all(products.map(product => validateLink(ALI_REF_PREFIX[region] + encodeURIComponent(product.link), product.id)))

      // for (const validLink of validLinks) {
      //   if (validLink.body.message) {
      //     validIds.push(validLink.id)
      //   }
      // }

      // products = products.filter(product => validIds.includes(product.id))

      products = products.sort(() => Math.random() - 0.5).slice(0, 20)

      return products.map((product) => {
        return {
          ...product,
          link: ALI_REF_PREFIX[region] + encodeURIComponent(product.link),
        }
      })
    }
    await new Promise(resolve => setTimeout(resolve, 300 * i))
  }
}

module.exports = {
  search,
}
