import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromotionBanner } from '@/components/layout/PromotionBanner'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import type { Metadata } from 'next'
import { getLocaleMetadata, siteName, siteUrl } from '@/lib/seo'
import '../globals.css'

const locales = ['en', 'zh-hk']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const localized = getLocaleMetadata(locale)
  const localePath = locale === 'en' ? '/en/' : '/zh-hk/'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: localized.title as string,
      template: `%s | ${siteName}`,
    },
    description: localized.description,
    keywords: localized.keywords,
    authors: [{ name: siteName }],
    alternates: {
      canonical: localePath,
      languages: {
        en: '/en/',
        'zh-HK': '/zh-hk/',
        'x-default': '/zh-hk/',
      },
    },
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: localePath,
      siteName,
      type: 'website',
      locale: locale === 'en' ? 'en_HK' : 'zh_HK',
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.title,
      description: localized.description,
    },
  }
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
          <Footer locale={locale} />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
