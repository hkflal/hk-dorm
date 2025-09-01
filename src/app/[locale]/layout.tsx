import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromotionBanner } from '@/components/layout/PromotionBanner'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import '../globals.css'

const locales = ['en', 'zh-hk']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: '外勞宿舍 - 香港勞工宿舍',
  description: '在香港尋找完美的宿舍。舒適、實惠且位置便利的打工人、學生和年輕專業人士住宿。',
  keywords: '香港, 勞工宿舍, 宿舍, 住宿, 租房',
  authors: [{ name: '外勞宿舍' }],
  openGraph: {
    title: '外勞宿舍 - 雇主話可靠的香港勞工宿舍',
    description: '全港性價比最高的勞工宿舍',
    type: 'website',
    locale: 'zh_HK',
  },
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!locales.includes(locale)) notFound()
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale })
  
  return (
    <html lang={locale}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <PromotionBanner />
          <Header locale={locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}