'use client'

import type { ReactNode } from 'react'
import { reportGoogleAdsConversion } from '@/lib/google-ads'

export function TrackedWhatsAppLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-google-ads-conversion="whatsapp"
      onClick={() => reportGoogleAdsConversion()}
    >
      {children}
    </a>
  )
}
