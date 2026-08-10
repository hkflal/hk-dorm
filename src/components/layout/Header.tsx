'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from './LanguageToggle'

export function Header({ locale = 'zh-hk' }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const zh = locale === 'zh-hk'
  const nav = [{ href: `/${locale}/`, label: zh ? '找宿舍' : 'Find a dorm' }, { href: `/${locale}/about/`, label: zh ? '平台資料' : 'About' }]
  return <header className="sticky top-10 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href={`/${locale}/`} className="flex min-h-11 items-center gap-2" aria-label={zh ? '外勞宿舍 Labour Dorm 首頁' : 'Labour Dorm home'}><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-sm font-bold text-white">LD</span><strong className="whitespace-nowrap text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">{zh ? '外勞宿舍 Labour Dorm' : 'Labour Dorm'}</strong></Link><nav className="hidden items-center gap-6 md:flex">{nav.map((item) => <Link key={item.href} className="min-h-11 px-1 py-3 text-sm font-medium text-slate-700 hover:text-blue-700" href={item.href}>{item.label}</Link>)}<LanguageToggle /></nav><div className="md:hidden"><button aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-xl text-slate-700 hover:bg-slate-100" aria-label={open ? (zh ? '關閉選單' : 'Close menu') : (zh ? '開啟選單' : 'Open menu')}>{open ? <X /> : <Menu />}</button></div></div>{open && <nav id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">{nav.map((item) => <Link onClick={() => setOpen(false)} key={item.href} className="block min-h-11 py-3 text-sm font-medium text-slate-700" href={item.href}>{item.label}</Link>)}<LanguageToggle /></nav>}</header>
}
