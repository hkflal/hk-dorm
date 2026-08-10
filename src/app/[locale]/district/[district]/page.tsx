import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { getProperties } from '@/lib/data'
import { isIndexableProperty } from '@/lib/property-visibility'
import { siteUrl } from '@/lib/seo'

type PageProps = { params: Promise<{ locale: string; district: string }> }

function districtUrl(district: string) {
  return encodeURIComponent(district)
}

export async function generateStaticParams() {
  const properties = (await getProperties()).filter(isIndexableProperty)
  const districts = [...new Set(properties.map((property) => property.district))]
  return ['zh-hk', 'en'].flatMap((locale) => districts.map((district) => ({ locale, district })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, district } = await params
  const isEnglish = locale === 'en'
  const title = isEnglish ? `Worker dormitory beds in ${district}, Hong Kong` : `${district}勞工宿舍及月租床位`
  const description = isEnglish
    ? `Browse available worker accommodation and monthly dormitory beds in ${district}, Hong Kong. Enquire on WhatsApp to confirm availability.`
    : `瀏覽${district}的勞工宿舍及月租床位，查看住宿資料後可透過 WhatsApp 確認空缺及入住安排。`
  const path = `/${locale}/district/${districtUrl(district)}/`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website' },
  }
}

export default async function DistrictPage({ params }: PageProps) {
  const { locale, district } = await params
  const isEnglish = locale === 'en'
  const properties = (await getProperties()).filter((property) => isIndexableProperty(property) && property.district === district)
  const title = isEnglish ? `Worker accommodation in ${district}` : `${district}勞工住宿`
  const description = isEnglish
    ? `Compare monthly bed prices, facilities and availability in ${district}. Please confirm the final bed availability with our team before moving in.`
    : `比較${district}月租床位、設施及可入住日期。入住前請透過 WhatsApp 向我們確認最後空缺。`
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem', position: index + 1, name: locale === 'en' ? property.titleEn || property.title : property.title,
      url: `${siteUrl}/${locale}/property/${property.id}/`,
    })),
  }

  return <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }} />
    <Link href={`/${locale}/`} className="inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline-offset-4 hover:underline">{isEnglish ? '← All listings' : '← 所有房源'}</Link>
    <div className="mt-5 max-w-3xl">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"><MapPin className="h-4 w-4" />{district}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-700">{description}</p>
    </div>
    <section className="mt-10" aria-labelledby="district-listings">
      <h2 id="district-listings" className="text-xl font-semibold text-slate-950">{isEnglish ? `${properties.length} listings to enquire about` : `${properties.length} 個可查詢房源`}</h2>
      <div className="mt-5"><PropertyGrid properties={properties} locale={locale} /></div>
    </section>
  </main>
}
