'use client'

import React from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LanguageToggle() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const locale = params.locale as string

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'zh-hk' : 'en'
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {locale === 'en' ? '繁體中文' : 'English'}
      </span>
    </Button>
  )
}