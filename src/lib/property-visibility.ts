import { Property } from './types'

/**
 * Keep the public search useful even when a district temporarily has no
 * published listing. Property data may also contain smaller operational areas
 * (for example 旺角 or 北角), so those values are added below as well.
 */
export const HONG_KONG_DISTRICTS = [
  '中西區', '灣仔', '東區', '南區',
  '油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘',
  '葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島',
] as const

/** A single rule shared by homepage, sitemap and static property routes. */
export function isIndexableProperty(property: Property): boolean {
  return property.status === 'active' && property.images.length > 0
}

export function propertyDisplayName(property: Property, locale: string): string {
  return locale === 'en' ? property.titleEn || property.title : property.title
}

export function propertyDisplayAddress(property: Property, locale: string): string {
  if (locale !== 'en') return property.address
  if (property.addressEn) return property.addressEn
  const districtNames: Record<string, string> = {
    '旺角': 'Mong Kok',
    '銅鑼灣': 'Causeway Bay',
    '佐敦': 'Jordan',
    '尖沙咀': 'Tsim Sha Tsui',
    '荃灣': 'Tsuen Wan',
    '北角': 'North Point',
  }
  return `${districtNames[property.district] || 'Hong Kong'}, Hong Kong`
}

/** Keep district selectors consistent across the public search and admin table. */
export function getPropertyDistricts(properties: Property[]): string[] {
  const customDistricts = properties.map((property) => property.district).filter(Boolean)
  const allDistricts = [...new Set([...HONG_KONG_DISTRICTS, ...customDistricts])]
  const standardOrder = new Map<string, number>(HONG_KONG_DISTRICTS.map((district, index) => [district, index]))

  return allDistricts.sort((a, b) => {
    const aIndex = standardOrder.get(a)
    const bIndex = standardOrder.get(b)
    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex
    if (aIndex !== undefined) return -1
    if (bIndex !== undefined) return 1
    return a.localeCompare(b, 'zh-Hant')
  })
}
