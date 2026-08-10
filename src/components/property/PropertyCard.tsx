import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { Property } from '@/lib/types'
import { propertyDisplayName } from '@/lib/property-visibility'

export function PropertyCard({ property, locale }: { property: Property; locale: string }) {
  const zh = locale === 'zh-hk'
  const gender = property.gender === 'male' ? (zh ? '男士' : 'Male only') : property.gender === 'female' ? (zh ? '女士' : 'Female only') : (zh ? '不限性別' : 'Any gender')
  const available = property.available_at === 'now' ? (zh ? '即日可查詢' : 'Enquire now') : `${zh ? '最早' : 'From'} ${property.available_at}`
  const beds = property.availableBeds == null ? (zh ? '空缺請查詢確認' : 'Availability on enquiry') : `${property.availableBeds} ${zh ? '個可用床位' : 'beds available'}`
  return <article className="galaxy-card group overflow-hidden rounded-2xl border border-slate-200 bg-white"><Link href={`/${locale}/property/${property.id}/`} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"><div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><Image src={property.images[0]} alt={property.imageAlts?.[0] || propertyDisplayName(property, locale)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" /></div><div className="relative z-10 p-5"><div className="flex items-start justify-between gap-4"><div><p className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" />{property.district}</p><h3 className="mt-2 text-lg font-bold text-slate-950">{propertyDisplayName(property, locale)}</h3></div><p className="shrink-0 text-right text-lg font-bold text-slate-950">HK${property.price.toLocaleString()}<span className="block text-xs font-medium text-slate-500">{zh ? '/ 月 / 床位' : '/ month / bed'}</span></p></div><dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm"><div className="flex items-center gap-2 text-slate-700"><Users className="h-4 w-4 text-blue-700" />{beds}</div><div className="text-slate-700">{gender}</div><div className="col-span-2 flex items-center gap-2 text-slate-700"><CalendarDays className="h-4 w-4 text-blue-700" />{available}</div></dl><span className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700">{zh ? '查看房源與查詢方式' : 'View listing and enquire'}</span></div></Link></article>
}
