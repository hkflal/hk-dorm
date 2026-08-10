'use client'

import { ExternalLink, MapPin, Navigation } from 'lucide-react'

export function GoogleMap({ address, nearbyMTR = [] }: { address: string; title: string; coordinates?: { lat: number; lng: number }; nearbyMTR?: string[] }) {
  const query = encodeURIComponent(address)
  return <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700"><MapPin className="h-5 w-5" /></div><div><h4 className="font-semibold text-slate-950">位置與交通</h4><p className="mt-1 text-sm leading-6 text-slate-600">{address}</p>{nearbyMTR.length > 0 && <p className="mt-2 text-sm text-slate-700">附近港鐵：{nearbyMTR.join('、')}</p>}</div></div><div className="mt-5 flex flex-wrap gap-3"><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-100"><ExternalLink className="h-4 w-4" />在 Google Maps 查看</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${query}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-100"><Navigation className="h-4 w-4" />取得路線</a></div></section>
}
