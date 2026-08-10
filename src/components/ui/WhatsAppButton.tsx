'use client'

import { MessageCircle } from 'lucide-react'
import { reportGoogleAdsConversion } from '@/lib/google-ads'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  locale?: string
}

export function WhatsAppButton({ 
  phoneNumber = '+85244130760', 
  message,
  locale = 'zh-hk',
}: WhatsAppButtonProps) {
  const defaultMessage = locale === 'en' ? 'Hello, I would like to know more about Labour Dorm accommodation.' : '你好！我想了解更多關於宿舍的資訊。'

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || defaultMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    reportGoogleAdsConversion()
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      data-google-ads-conversion="whatsapp"
      className="galaxy-cta fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-white transition-all duration-300 group"
      aria-label={locale === 'en' ? 'Enquire on WhatsApp' : 'WhatsApp 即時查詢'}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium whitespace-nowrap">{locale === 'en' ? 'WhatsApp enquiry' : 'WhatsApp 查詢'}</span>
    </button>
  )
}
