import { Property } from '@/lib/types'
import { PropertyCard } from './PropertyCard'

export function PropertyGrid({ properties, locale }: { properties: Property[]; locale: string }) {
  if (!properties.length) return <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center"><h3 className="text-lg font-semibold text-slate-950">{locale === 'zh-hk' ? '暫時沒有符合條件的房源' : 'No matching listings right now'}</h3><p className="mt-2 text-sm text-slate-600">{locale === 'zh-hk' ? '請放寬篩選條件，或直接 WhatsApp 查詢其他安排。' : 'Try broader filters, or enquire on WhatsApp for other options.'}</p></div>
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property} locale={locale} />)}</div>
}
