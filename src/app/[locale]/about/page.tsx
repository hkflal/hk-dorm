import Link from 'next/link'
import { CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  const path = `/${isEnglish ? 'en' : 'zh-hk'}/about/`
  const title = isEnglish ? 'About Labour Dorm' : '關於 Labour Dorm'
  const description = isEnglish ? 'How to use Labour Dorm to compare monthly worker accommodation in Hong Kong.' : '了解如何使用 Labour Dorm 比較香港月租勞工住宿。'
  return { title, description, alternates: { canonical: path, languages: { en: '/en/about/', 'zh-HK': '/zh-hk/about/', 'x-default': '/zh-hk/about/' } }, openGraph: { title, description, url: `${siteUrl}${path}`, type: 'website', images: ['/images/hero-dorm.jpg'] } }
}

export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'zh-hk' }] }

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const zh = locale === 'zh-hk'
  const steps = zh ? [['瀏覽房源', '按地區、性別和預計入住時間縮小選擇。'], ['查看資料', '比較月租、可用床位、設施和附近交通。'], ['直接確認', '以 WhatsApp 與我們確認最新床位、費用和入住安排。']] : [['Browse listings', 'Narrow choices by district, gender and intended move-in time.'], ['Check details', 'Compare monthly rent, available beds, facilities and nearby transport.'], ['Confirm directly', 'Use WhatsApp to confirm the latest beds, fees and move-in arrangements.']]
  return <main><section className="bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto max-w-3xl"><p className="text-sm font-semibold text-emerald-300">Labour Dorm</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{zh ? '幫你更快掌握月租住宿資料。' : 'A clearer way to compare monthly accommodation.'}</h1><p className="mt-5 text-lg leading-8 text-slate-200">{zh ? 'Labour Dorm 整理香港月租勞工住宿資料。網站資料用來協助比較；實際床位、費用及入住安排均以最終確認為準。' : 'Labour Dorm brings together monthly worker accommodation details in Hong Kong. Use the site to compare options, then confirm availability, fees and move-in arrangements directly.'}</p></div></section><section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold text-slate-950">{zh ? '如何使用' : 'How it works'}</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{steps.map(([title, description], index) => <article key={title} className="rounded-2xl border border-slate-200 p-6"><p className="text-sm font-semibold text-blue-700">0{index + 1}</p><h3 className="mt-4 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></article>)}</div></section><section className="border-y border-slate-200 bg-slate-50"><div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8"><div><ShieldCheck className="h-8 w-8 text-blue-700" /><h2 className="mt-4 text-2xl font-bold text-slate-950">{zh ? '資料使用原則' : 'Using listing information'}</h2><ul className="mt-4 space-y-3 text-slate-700"><li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{zh ? '入住前請確認可用床位、月租、按金和最短租期。' : 'Confirm available beds, rent, deposit and minimum stay before moving in.'}</li><li className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{zh ? '不要只根據網站資料付款或作最後決定。' : 'Do not make payment or a final decision based on the website alone.'}</li></ul></div><div className="rounded-2xl bg-white p-6 shadow-sm"><MessageCircle className="h-8 w-8 text-emerald-600" /><h2 className="mt-4 text-2xl font-bold text-slate-950">{zh ? '需要協助？' : 'Need help?'}</h2><p className="mt-3 leading-7 text-slate-600">{zh ? '把房源名稱、入住日期和所需床位告訴我們，我們會協助確認。' : 'Send us the listing name, intended move-in date and beds needed so we can help confirm.'}</p><a className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700" href="https://wa.me/85244130760" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a></div></div></section></main>
}
