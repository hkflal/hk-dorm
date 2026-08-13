'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Archive, Eye, EyeOff, ExternalLink, FilePenLine, LoaderCircle, LogOut, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { useAuth } from '@/contexts/AuthContext'
import { adminDataMode, adminReadOnlyNotice, adminWritesAvailable, archiveProperty, createProperty, deletePropertyPermanently, getAdminFallbackProperties, getAdminProperties, getAdminStats, resetLocalAdminProperties, setPropertyPublished, updateProperty } from '@/lib/firebase-services'
import { getPropertyDistricts, isIndexableProperty } from '@/lib/property-visibility'
import { Property } from '@/lib/types'

export default function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter()
  const { user, isAdmin, loading: authLoading, signOutUser } = useAuth()
  const [locale, setLocale] = useState('zh-hk')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [district, setDistrict] = useState('all')
  const [readOnlyReason, setReadOnlyReason] = useState('')
  const [editing, setEditing] = useState<Property | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => { params.then(({ locale: nextLocale }) => setLocale(nextLocale)) }, [params])
  useEffect(() => { if (!authLoading && (!user || !isAdmin)) router.replace(`/${locale}/auth/login/`) }, [authLoading, user, isAdmin, router, locale])

  const load = async () => {
    if (!isAdmin) return
    setLoading(true); setError(''); setReadOnlyReason('')
    try {
      setProperties(await getAdminProperties())
    } catch {
      setProperties(getAdminFallbackProperties())
      setReadOnlyReason(adminReadOnlyNotice)
    } finally { setLoading(false) }
  }
  useEffect(() => { if (isAdmin) void load() }, [isAdmin])
  const stats = useMemo(() => getAdminStats(properties), [properties])
  const writesEnabled = adminWritesAvailable && !readOnlyReason
  const filtered = useMemo(() => properties.filter((property) => {
    const matchesText = [property.title, property.titleEn, property.address, property.property_id].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === 'all'
      ? true
      : status === 'published'
        ? isIndexableProperty(property)
        : property.status === status
    return matchesText
      && matchesStatus
      && (district === 'all' || property.district === district)
  }), [properties, search, status, district])

  const save = async (data: Partial<Property>) => {
    setError('')
    try {
      if (editing && editing !== 'new') await updateProperty(editing.id, data)
      else await createProperty(data)
      setEditing(null); await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '未能儲存房源。')
    }
  }
  const archive = async (property: Property) => { if (window.confirm(`確定下架「${property.title}」？公開網站將不再顯示。`)) { await archiveProperty(property.id); await load() } }
  const togglePublished = async (property: Property) => {
    setError('')
    setTogglingId(property.id)
    try {
      await setPropertyPublished(property.id, property.status !== 'active')
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '未能更新發布狀態。')
    } finally { setTogglingId(null) }
  }
  const permanentlyDelete = async () => { if (!deleteTarget || confirmText !== deleteTarget.property_id) return; await deletePropertyPermanently(deleteTarget.id); setDeleteTarget(null); setConfirmText(''); await load() }
  const resetLocalData = async () => {
    if (!window.confirm('確定要捨棄所有本地測試改動，還原網站原有房源？')) return
    await resetLocalAdminProperties()
    await load()
  }
  const logout = async () => { await signOutUser(); router.replace(`/${locale}/auth/login/`) }

  if (authLoading || !user || !isAdmin) return <main className="grid min-h-[60dvh] place-items-center"><LoaderCircle className="h-7 w-7 animate-spin text-blue-600" /></main>
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-700">Labour Dorm</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">房源管理</h1><p className="mt-2 text-sm text-slate-600">登入帳戶：{user.email}</p></div><div className="flex flex-wrap gap-2"><Link href={`/${locale}/`} target="_blank"><Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" />預覽網站</Button></Link>{adminDataMode === 'local' && <Button variant="outline" onClick={resetLocalData}><RotateCcw className="mr-2 h-4 w-4" />重設本地資料</Button>}<Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4" />登出</Button><Button variant="secondary" onClick={() => setEditing('new')} disabled={!writesEnabled}><Plus className="mr-2 h-4 w-4" />新增房源</Button></div></div>
    {adminDataMode === 'local' && <p role="status" className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">本地測試資料模式：新增、編輯、下架及刪除只會儲存在這個瀏覽器，不會發布到網站，也不會改動正式 Firebase。</p>}
    {adminDataMode === 'readonly' && <p role="status" className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">目前顯示網站內的現有房源。尚未啟動本地測試資料庫，因此寫入功能暫時停用。</p>}
    {readOnlyReason && <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{readOnlyReason}</p>}
    <section className="mt-6 grid gap-3 sm:grid-cols-4">{[['全部', stats.total, 'bg-slate-100 text-slate-950'], ['已發布', stats.published, 'bg-emerald-50 text-emerald-800'], ['草稿', stats.drafts, 'bg-amber-50 text-amber-800'], ['已封存', stats.archived, 'bg-slate-100 text-slate-700']].map(([label, value, style]) => <div key={String(label)} className={`rounded-2xl px-5 py-4 ${style}`}><p className="text-sm">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</section>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">搜尋房源</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder="搜尋名稱、地址或 Property ID" /></label><select aria-label="地區" value={district} onChange={(event) => setDistrict(event.target.value)} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"><option value="all">全部地區</option>{getPropertyDistricts(status === 'published' ? properties.filter(isIndexableProperty) : properties).map((item) => <option key={item} value={item}>{item}</option>)}</select><select aria-label="房源範圍" value={status} onChange={(event) => { setStatus(event.target.value); setDistrict('all') }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"><option value="published">公開房源</option><option value="all">全部資料</option><option value="active">已發布（包括未公開）</option><option value="pending">草稿</option><option value="inactive">已封存</option></select></div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr><th className="px-3 py-3 font-medium">房源</th><th className="px-3 py-3 font-medium">床位／性別</th><th className="px-3 py-3 font-medium">月租</th><th className="px-3 py-3 font-medium">狀態</th><th className="px-3 py-3 font-medium">操作</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="px-3 py-10 text-center text-slate-500">載入中…</td></tr> : filtered.map((property) => <tr key={property.id} className="border-b border-slate-100"><td className="px-3 py-3"><div className="flex items-center gap-3">{property.images?.[0] ? <img src={property.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="h-12 w-16 rounded-lg bg-slate-100" />}<div><p className="font-semibold text-slate-950">{property.title}</p><p className="text-slate-500">{property.property_id} · {property.district}</p></div></div></td><td className="px-3 py-3 text-slate-700">{property.availableBeds ?? '—'}／{property.totalBeds ?? property.details?.guests ?? '—'} · {property.gender === 'male' ? '男' : property.gender === 'female' ? '女' : '不限'}</td><td className="px-3 py-3 font-medium text-slate-950">HK${Number(property.price || 0).toLocaleString()}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${property.status === 'active' ? 'bg-emerald-50 text-emerald-800' : property.status === 'pending' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>{property.status === 'active' ? '已發布' : property.status === 'pending' ? '草稿' : '已封存'}</span></td><td className="px-3 py-3"><div className="flex gap-1"><button type="button" disabled={!writesEnabled || togglingId === property.id} onClick={() => void togglePublished(property)} className={`grid h-11 min-w-11 place-items-center rounded-xl px-2 text-xs font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 ${property.status === 'active' ? 'text-emerald-700' : 'text-amber-700'}`} aria-label={`${property.status === 'active' ? '取消發布' : '發布'} ${property.title}`} title={property.status === 'active' ? '取消發布' : '發布'}>{property.status === 'active' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button><button type="button" disabled={!writesEnabled} onClick={() => setEditing(property)} className="grid h-11 w-11 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`編輯 ${property.title}`}><FilePenLine className="h-4 w-4" /></button><button type="button" disabled={!writesEnabled} onClick={() => archive(property)} className="grid h-11 w-11 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`下架 ${property.title}`}><Archive className="h-4 w-4" /></button><button type="button" disabled={!writesEnabled} onClick={() => setDeleteTarget(property)} className="grid h-11 w-11 place-items-center rounded-xl text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35" aria-label={`永久刪除 ${property.title}`}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div></section>
    <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? '新增房源' : '編輯房源'}>{editing !== null && <PropertyForm property={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />}</Modal>
    <Modal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="永久刪除房源"><div className="space-y-4"><p className="text-sm leading-6 text-slate-700">這會刪除「{deleteTarget?.title}」及其 Firebase Storage 圖片，無法復原。</p><label className="block text-sm font-medium text-slate-800">輸入 <span className="font-mono">{deleteTarget?.property_id}</span> 確認<input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" /></label><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button><button disabled={confirmText !== deleteTarget?.property_id} onClick={permanentlyDelete} className="min-h-11 rounded-xl bg-red-700 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">永久刪除</button></div></div></Modal>
  </main>
}
