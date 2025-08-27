import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  // Validate locale parameter - provide a fallback if locale is undefined
  const validLocales = ['en', 'zh-hk']
  const finalLocale = locale && validLocales.includes(locale) ? locale : 'zh-hk'
  
  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  }
})