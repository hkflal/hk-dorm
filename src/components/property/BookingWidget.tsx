'use client'

import { useState } from 'react'
import { CalendarDays, MessageCircle, Users } from 'lucide-react'
import { Property } from '@/lib/types'
import { propertyDisplayName } from '@/lib/property-visibility'
import { TrackedWhatsAppLink } from '@/components/ui/TrackedWhatsAppLink'

export function BookingWidget({ property, locale = 'zh-hk' }: { property: Property; locale?: string }) {
  const zh = locale === 'zh-hk'
  const [moveIn, setMoveIn] = useState('')
  const [beds, setBeds] = useState(1)
  const text = encodeURIComponent(zh ? `你好，我想查詢「${property.title}」。入住日期：${moveIn || '未定'}；需要床位：${beds}。請問仍有空位嗎？` : `Hello, I would like to enquire about ${propertyDisplayName(property, locale)}. Move-in: ${moveIn || 'not decided'}; beds needed: ${beds}. Is it still available?`)
  return <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 lg:sticky lg:top-24"><p className="text-2xl font-bold text-slate-950">HK${property.price.toLocaleString()}<span className="ml-1 text-sm font-medium text-slate-500">{zh ? '/ 月 / 床位' : '/ month / bed'}</span></p><p className="mt-2 text-sm leading-6 text-slate-600">{zh ? '費用、可用床位和入住日期以 WhatsApp 最終確認為準。' : 'Fees, available beds and move-in timing are confirmed on WhatsApp.'}</p><div className="mt-5 space-y-3"><label className="block text-sm font-medium text-slate-700"><span className="mb-1 flex items-center gap-2"><CalendarDays className="h-4 w-4" />{zh ? '預計入住日期' : 'Expected move-in date'}</span><input type="date" value={moveIn} onChange={(event) => setMoveIn(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 px-3" /></label><label className="block text-sm font-medium text-slate-700"><span className="mb-1 flex items-center gap-2"><Users className="h-4 w-4" />{zh ? '所需床位' : 'Beds needed'}</span><input type="number" min="1" max={property.availableBeds || property.details.guests || 20} value={beds} onChange={(event) => setBeds(Math.max(1, Number(event.target.value)))} className="min-h-11 w-full rounded-xl border border-slate-300 px-3" /></label></div><TrackedWhatsAppLink className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700" href={`https://wa.me/85244130760?text=${text}`}><MessageCircle className="h-5 w-5" />{zh ? '以 WhatsApp 查詢' : 'Enquire on WhatsApp'}</TrackedWhatsAppLink></aside>
}
