import type { MetadataRoute } from 'next'
import { enhancedProperties } from '@/lib/enhanced-data'
import { siteUrl, supportedLocales } from '@/lib/seo'
import { isIndexableProperty } from '@/lib/property-visibility'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = supportedLocales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}/`,
      lastModified: new Date('2026-07-19'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/${locale}/about/`,
      lastModified: new Date('2026-07-19'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...enhancedProperties
      .filter(isIndexableProperty)
      .map((property) => ({
        url: `${siteUrl}/${locale}/property/${property.id}/`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ...[...new Set(enhancedProperties.filter(isIndexableProperty).map((property) => property.district))].map((district) => ({
      url: `${siteUrl}/${locale}/district/${encodeURIComponent(district)}/`,
      lastModified: new Date('2026-07-30'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ])

  return entries
}
