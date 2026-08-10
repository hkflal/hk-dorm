import { StickyBanner } from '@/components/ui/sticky-banner'
import { TrackedWhatsAppLink } from '@/components/ui/TrackedWhatsAppLink'

export function PromotionBanner({ locale }: { locale: string }) {
  const zh = locale === 'zh-hk'
  const monthIndex = new Date().getMonth()
  const month = zh
    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][monthIndex]
    : new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date())

  return (
    <StickyBanner className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-red-800">
      <p className="flex max-w-full items-center justify-center gap-1.5 whitespace-nowrap text-xs font-semibold drop-shadow-sm sm:gap-2 sm:text-sm">
        <span className="sm:hidden">{zh ? `${month}床位低至` : `${month} beds from`}</span>
        <span className="hidden sm:inline">
          {zh ? `${month}僱主直租勞工宿舍床位，月租低至` : `${month} worker dormitory beds from`}
        </span>
        <strong className="text-base font-extrabold tracking-tight text-red-900 sm:text-lg">HK$2,800</strong>
        <span className="hidden sm:inline">{zh ? '／月' : '/month'}</span>
        <TrackedWhatsAppLink
          href="https://wa.me/85244130760"
          className="inline-flex min-h-9 items-center rounded-md px-1 font-bold text-red-900 underline-offset-2 transition-colors hover:text-red-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-900"
        >
          {zh ? '立即查詢 →' : 'Enquire →'}
        </TrackedWhatsAppLink>
      </p>
    </StickyBanner>
  )
}
