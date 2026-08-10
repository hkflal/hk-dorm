const GOOGLE_ADS_CONVERSION = 'AW-11323045023/CKNSCKD65eoYEJ_pn5cq'

type GoogleTag = (
  command: 'event',
  eventName: 'conversion',
  parameters: { send_to: string; event_callback: () => void },
) => void

type GoogleWindow = Window & { gtag?: GoogleTag }

/** Report a conversion while allowing the original WhatsApp action to continue. */
export function reportGoogleAdsConversion(url?: string): false {
  const callback = () => {
    if (typeof url !== 'undefined') window.location.href = url
  }

  if (typeof window === 'undefined') return false

  const gtag = (window as GoogleWindow).gtag
  if (typeof gtag !== 'function') {
    callback()
    return false
  }

  gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_CONVERSION,
    event_callback: callback,
  })
  return false
}
