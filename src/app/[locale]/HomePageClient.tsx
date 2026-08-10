'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, MapPin, MessageCircle, Search, Users } from 'lucide-react'
import { HomeFaq } from '@/components/content/HomeFaq'
import { HeroTitle } from '@/components/layout/HeroTitle'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { getPublicProperties } from '@/lib/firebase-services'
import { Property } from '@/lib/types'
import { getPropertyDistricts } from '@/lib/property-visibility'

type SearchFilters = {
  district: string
  gender: string
}

const initialFilters: SearchFilters = {
  district: 'all',
  gender: 'all',
}

export default function HomePageClient({ locale = 'zh-hk', initialProperties }: { locale?: string; initialProperties: Property[] }) {
  const zh = locale === 'zh-hk'
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(initialFilters)
  const [propertiesFromDatabase, setPropertiesFromDatabase] = useState<Property[] | null>(null)
  const catalogue = propertiesFromDatabase === null ? initialProperties : propertiesFromDatabase

  useEffect(() => {
    getPublicProperties()
      .then((items) => setPropertiesFromDatabase(items))
      .catch(() => undefined)
  }, [])

  const districts = useMemo(() => getPropertyDistricts(catalogue), [catalogue])
  const properties = catalogue.filter((property) =>
    (appliedFilters.district === 'all' || property.district === appliedFilters.district)
    && (appliedFilters.gender === 'all' || property.gender === 'any' || property.gender === appliedFilters.gender)
  )
  const query = encodeURIComponent(zh
    ? `你好，我想查詢勞工宿舍。地區：${appliedFilters.district === 'all' ? '不限' : appliedFilters.district}；性別：${appliedFilters.gender === 'all' ? '不限' : appliedFilters.gender === 'male' ? '男士' : '女士'}。`
    : `Hello, I would like to enquire about worker accommodation. District: ${appliedFilters.district}; gender: ${appliedFilters.gender}.`)

  function updateFilter(name: keyof SearchFilters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function searchListings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedFilters(filters)

    window.setTimeout(() => {
      const listings = document.getElementById('listings')
      const heading = document.getElementById('listings-title')
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      listings?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      heading?.focus({ preventScroll: true })
    }, 0)
  }

  return <>
    <section className="home-hero relative isolate overflow-hidden bg-slate-950">
      <Image src="/images/hero-dorm.jpg" alt="" aria-hidden="true" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-slate-950/80" />
      <span className="home-hero-blob home-hero-blob--blue" aria-hidden="true" />
      <span className="home-hero-blob home-hero-blob--yellow" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)] lg:gap-14 lg:px-10 lg:py-24">
        <HeroTitle locale={locale} />

        <form className="home-search-shell" onSubmit={searchListings} aria-label={zh ? '搜尋月租宿舍' : 'Search monthly accommodation'}>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{zh ? '即時篩選' : 'Find a suitable bed'}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{zh ? '你打算在哪區入住？' : 'Where do you need to stay?'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{zh ? '先選條件，再查看目前可供查詢的房源。' : 'Choose your requirements, then view the listings available to enquire about.'}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Filter icon={<MapPin aria-hidden="true" />} label={zh ? '地區' : 'District'}>
              <select value={filters.district} onChange={(event) => updateFilter('district', event.target.value)}>
                <option value="all">{zh ? '全部地區' : 'All districts'}</option>
                {districts.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Filter>
            <Filter icon={<Users aria-hidden="true" />} label={zh ? '住宿性別' : 'Gender'}>
              <select value={filters.gender} onChange={(event) => updateFilter('gender', event.target.value)}>
                <option value="all">{zh ? '不限' : 'Any'}</option>
                <option value="male">{zh ? '男士' : 'Male'}</option>
                <option value="female">{zh ? '女士' : 'Female'}</option>
              </select>
            </Filter>
          </div>

          <button type="submit" className="home-search-primary mt-5">
            <Search className="home-search-primary__icon h-5 w-5" aria-hidden="true" />
            <span>{zh ? '搜尋房源' : 'Search listings'}</span>
            <ArrowRight className="ml-auto h-5 w-5" aria-hidden="true" />
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">{zh ? '房源資料會持續更新，實際床位以查詢時確認為準。' : 'Listings are updated regularly. Confirm the actual bed availability before moving in.'}</p>
        </form>
      </div>
    </section>

    <section id="listings" className="scroll-mt-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-blue-700">{zh ? '月租住宿選擇' : 'Monthly accommodation'}</p>
            <h2 id="listings-title" tabIndex={-1} className="mt-2 text-3xl font-bold tracking-tight text-slate-950 outline-none sm:text-4xl">{zh ? '可查詢的月租床位' : 'Monthly beds to enquire about'}</h2>
            <p className="mt-3 text-slate-600" aria-live="polite">{zh ? `${properties.length} 個房源符合目前篩選。` : `${properties.length} listings match your filters.`}</p>
          </div>
          <a href={`https://wa.me/85244130760?text=${query}`} target="_blank" rel="noopener noreferrer" className="home-whatsapp-secondary">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span>{zh ? '找不到合適房源？WhatsApp 查詢' : 'Need another option? Ask on WhatsApp'}</span>
          </a>
        </div>
        <PropertyGrid properties={properties} locale={locale} />
      </div>
    </section>

    <HomeFaq locale={locale} />
  </>
}

function Filter({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="home-filter">
    <span className="home-filter__icon">{icon}</span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-bold text-slate-500">{label}</span>
      <span className="home-filter__control">{children}</span>
    </span>
  </label>
}
