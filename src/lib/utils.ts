import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('zh-HK', {
    style: 'currency',
    currency: 'HKD',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date, locale: string = 'en') {
  return new Intl.DateTimeFormat(locale === 'zh-hk' ? 'zh-HK' : 'en-HK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}