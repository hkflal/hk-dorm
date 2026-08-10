import HomePageClient from './HomePageClient'
import { getProperties } from '@/lib/data'
import { isIndexableProperty } from '@/lib/property-visibility'
import { siteName, siteUrl } from '@/lib/seo'

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-hk' }
  ]
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const properties = (await getProperties()).filter(isIndexableProperty)
  const isEnglish = locale === 'en'
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        contactPoint: { '@type': 'ContactPoint', telephone: '+852-4413-0760', contactType: 'customer service', availableLanguage: ['Chinese', 'English'] },
      },
      {
        '@type': 'WebSite',
        name: isEnglish ? 'Labour Dorm Hong Kong' : '香港勞工宿舍',
        url: `${siteUrl}/${locale}/`,
        inLanguage: isEnglish ? 'en' : 'zh-HK',
      },
    ],
  }

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} /><HomePageClient locale={locale} initialProperties={properties} /></>
}
