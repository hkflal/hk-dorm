import type { Metadata } from 'next'

export const siteUrl = 'https://labour-dorm.com'
export const siteName = 'Labour Dorm'
export const supportedLocales = ['en', 'zh-hk'] as const

type SupportedLocale = (typeof supportedLocales)[number]

const localizedMetadata: Record<SupportedLocale, Pick<Metadata, 'title' | 'description' | 'keywords'>> = {
  'zh-hk': {
    title: '香港勞工宿舍 | Labour Dorm',
    description: '尋找香港勞工宿舍及月租床位。瀏覽旺角等地區的住宿資料、設施和每月租金，直接透過 WhatsApp 查詢入住安排。',
    keywords: ['香港勞工宿舍', '香港月租床位', '外勞宿舍', '旺角宿舍', '香港住宿'],
  },
  en: {
    title: 'Hong Kong Labour Dormitories | Labour Dorm',
    description: 'Find monthly labour dormitory beds in Hong Kong. Compare accommodation, amenities and locations, then enquire directly on WhatsApp.',
    keywords: ['Hong Kong labour dormitory', 'monthly dorm bed Hong Kong', 'worker accommodation Hong Kong'],
  },
}

export function getLocaleMetadata(locale: string) {
  return localizedMetadata[locale as SupportedLocale] ?? localizedMetadata['zh-hk']
}
