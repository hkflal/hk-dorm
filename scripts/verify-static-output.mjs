import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const output = resolve('out')
const sitemap = resolve(output, 'sitemap.xml')
if (!existsSync(sitemap)) throw new Error('Missing out/sitemap.xml')

const xml = readFileSync(sitemap, 'utf8')
const urls = [...xml.matchAll(/<loc>https:\/\/labour-dorm\.com([^<]+)<\/loc>/g)].map((match) => match[1])
if (!urls.length) throw new Error('Sitemap contains no Labour Dorm URLs')

const missing = urls.filter((url) => !existsSync(resolve(output, `.${decodeURIComponent(url)}`, 'index.html')))
if (missing.length) throw new Error(`Sitemap points to missing static pages: ${missing.join(', ')}`)

const expectations = {
  en: {
    faqHeading: 'Frequently asked questions',
    search: 'Search listings',
    month: new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date()),
  },
  'zh-hk': {
    faqHeading: '常見問題',
    search: '搜尋房源',
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date().getMonth()],
  },
}

const allHongKongDistricts = [
  '中西區', '灣仔', '東區', '南區',
  '油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘',
  '葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島',
]

for (const locale of ['en', 'zh-hk']) {
  const html = readFileSync(resolve(output, locale, 'index.html'), 'utf8')
  if (!html.includes('<h1')) throw new Error(`Missing H1 on /${locale}/`)
  if (!html.includes('rel="canonical"')) throw new Error(`Missing canonical on /${locale}/`)
  if (!html.includes(expectations[locale].faqHeading)) throw new Error(`Missing FAQ heading on /${locale}/`)
  if (!html.includes(expectations[locale].search)) throw new Error(`Missing primary search action on /${locale}/`)
  if (!html.includes('HK$2,800')) throw new Error(`Missing promotional price on /${locale}/`)
  if (!html.includes(expectations[locale].month)) throw new Error(`Missing current promotion month on /${locale}/`)
  // Next serializes the Script props in its flight payload and emits a
  // preload link; count the actual preload rather than duplicated serialized
  // URL text.
  const googleTagLoaderCount = [...html.matchAll(/<link rel="preload" href="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-11323045023" as="script"\s*\/>/g)].length
  if (googleTagLoaderCount !== 1) throw new Error(`Expected one Google Ads loader preload on /${locale}/; found ${googleTagLoaderCount}`)
  const googleTagConfigCount = [...html.matchAll(/gtag\('config', 'AW-11323045023'\)/g)].length
  if (googleTagConfigCount !== 1) throw new Error(`Expected one Google Ads config on /${locale}/; found ${googleTagConfigCount}`)
  for (const district of allHongKongDistricts) {
    if (!html.includes(`>${district}</option>`)) throw new Error(`Missing district filter option ${district} on /${locale}/`)
  }

  const propertyLinks = [...html.matchAll(new RegExp(`href="/${locale}/property/`, 'g'))]
  if (propertyLinks.length < 1) throw new Error(`Missing server-rendered property cards on /${locale}/`)

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
  const faqBlocks = jsonLdBlocks.filter((block) => block.includes('"@type":"FAQPage"'))
  if (faqBlocks.length !== 1) throw new Error(`Expected exactly one FAQPage JSON-LD block on /${locale}/; found ${faqBlocks.length}`)

  const faqQuestions = [...faqBlocks[0].matchAll(/"@type":"Question"/g)]
  if (faqQuestions.length < 8) throw new Error(`Expected at least eight FAQ questions on /${locale}/; found ${faqQuestions.length}`)

  const toggleCount = [...html.matchAll(/aria-expanded="(?:true|false)"/g)].length
  if (toggleCount < 8) throw new Error(`Expected at least eight accessible FAQ toggles on /${locale}/; found ${toggleCount}`)

  if (locale === 'zh-hk') {
    for (const keyword of ['外勞宿舍', '勞工宿舍', '員工宿舍']) {
      if (!html.includes(keyword)) throw new Error(`Missing approved Chinese search phrase: ${keyword}`)
    }
    if (!html.includes('<title>香港外勞宿舍、勞工宿舍及員工宿舍月租 | Labour Dorm</title>')) {
      throw new Error('Chinese homepage title does not contain the approved search phrases')
    }
  }
}

console.log(`Verified ${urls.length} sitemap URLs, property cards, promotion, search, and bilingual FAQ output.`)
