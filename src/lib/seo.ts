import type { Metadata } from 'next'

export const siteUrl = 'https://labour-dorm.com'
export const siteName = 'Labour Dorm'
export const supportedLocales = ['en', 'zh-hk'] as const

type SupportedLocale = (typeof supportedLocales)[number]

const localizedMetadata: Record<SupportedLocale, Pick<Metadata, 'title' | 'description' | 'keywords'>> = {
  'zh-hk': {
    title: '香港外勞宿舍、勞工宿舍及員工宿舍月租 | Labour Dorm',
    description: '尋找香港外勞宿舍、勞工宿舍及員工宿舍月租床位。按地區、住宿性別和入住日期查看現有房源，再確認租金及入住安排。',
    keywords: ['香港外勞宿舍', '香港勞工宿舍', '香港員工宿舍', '外勞宿舍月租', '勞工宿舍床位', '員工宿舍月租'],
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
