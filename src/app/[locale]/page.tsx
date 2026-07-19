import HomePageClient from './HomePageClient'
import { getProperties } from '@/lib/data'

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
  const properties = (await getProperties()).filter(property => 
    property.images && property.images.length > 0
  )

  return <HomePageClient locale={locale} initialProperties={properties} />
}
