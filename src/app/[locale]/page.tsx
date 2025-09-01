import HomePageClient from './HomePageClient'

export const metadata = {
  title: '外勞宿舍 - 香港勞工宿舍',
  description: '在香港尋找完美的宿舍。舒適、實惠且位置便利的打工人、學生和年輕專業人士住宿。',
}

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
  return <HomePageClient locale={locale} />
}