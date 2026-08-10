import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromotionBanner } from '@/components/layout/PromotionBanner'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { AuthProvider } from '@/contexts/AuthContext'
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
  const title = localized.title || undefined
  const description = localized.description || undefined

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title as string,
      template: `%s | ${siteName}`,
    },
    description,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    openGraph: {
      title,
      description,
      url: localePath,
      siteName,
      type: 'website',
      locale: locale === 'en' ? 'en_HK' : 'zh_HK',
      images: ['/images/hero-dorm.jpg'],
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
      <body className="font-sans">
        <AuthProvider><NextIntlClientProvider messages={messages}>
          <PromotionBanner locale={locale} />
          <div className="h-10" aria-hidden="true" />
          <Header locale={locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={locale} />
          <WhatsAppButton locale={locale} />
        </NextIntlClientProvider></AuthProvider>
      </body>
    </html>
  )
}
