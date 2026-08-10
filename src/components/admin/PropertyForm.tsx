'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { GripVertical, ImagePlus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/lib/types'
import { deletePropertyImage, uploadPropertyImage } from '@/lib/firebase-services'

type FormValues = {
  property_id: string; title: string; titleEn: string; description: string; descriptionEn: string
  address: string; addressEn: string; district: string; price: string; deposit: string; otherFees: string
  totalBeds: string; availableBeds: string; gender: 'male' | 'female' | 'any'; available_at: string
  minStayMonths: string; status: 'active' | 'pending' | 'inactive'; amenities: string; nearbyMTR: string
}

interface PropertyFormProps {
  property?: Property | null
  onSave: (data: Partial<Property>) => Promise<void>
  onCancel: () => void
}

function initialValues(property?: Property | null): FormValues {
  return {
    property_id: property?.property_id || '', title: property?.title || '', titleEn: property?.titleEn || '',
    description: property?.description || '', descriptionEn: property?.descriptionEn || '',
    address: property?.address || '', addressEn: property?.addressEn || '', district: property?.district || '',
    price: property?.price?.toString() || '', deposit: property?.deposit?.toString() || '', otherFees: property?.otherFees?.toString() || '',
    totalBeds: property?.totalBeds?.toString() || property?.details.guests?.toString() || '',
    availableBeds: property?.availableBeds?.toString() || '', gender: property?.gender || 'any',
    available_at: property?.available_at === 'now' ? '' : property?.available_at || '',
    minStayMonths: property?.minStayMonths?.toString() || '1', status: property?.status || 'pending',
    amenities: property?.amenities.join(', ') || '', nearbyMTR: property?.location.nearbyMTR.join(', ') || '',
  }
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [values, setValues] = useState(() => initialValues(property))
  const [images, setImages] = useState(property?.images || [])
  const [imageAlts, setImageAlts] = useState(property?.imageAlts || [])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [imagesPendingDeletion, setImagesPendingDeletion] = useState<string[]>([])
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<string[]>([])
  const draftKey = useMemo(() => values.property_id || property?.property_id || 'new-property', [values.property_id, property?.property_id])

  const update = (key: keyof FormValues, value: string) => {
    setDirty(true)
    setValues((current) => ({ ...current, [key]: value }))
  }

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setError('')
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((file) => uploadPropertyImage(file, draftKey)))
      setImages((current) => [...current, ...urls])
      setNewlyUploadedImages((current) => [...current, ...urls])
      setImageAlts((current) => [...current, ...files.map((file) => file.name.replace(/\.[^.]+$/, ''))])
      setDirty(true)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '圖片上載失敗，請重試。')
    } finally {
      event.target.value = ''
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const url = images[index]
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
    setImageAlts((current) => current.filter((_, imageIndex) => imageIndex !== index))
    if (property?.images.includes(url)) setImagesPendingDeletion((current) => [...current, url])
    setDirty(true)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!values.property_id || !values.title || !values.address || !values.district || !values.price || !values.totalBeds) {
      setError('請填寫 Property ID、中文名稱、地址、地區、月租及總床位。')
      return
    }
    if (!images.length) {
      setError('請最少上載一張房源圖片。')
      return
    }
    setSaving(true)
    try {
      const totalBeds = Number(values.totalBeds)
      const availableBeds = Number(values.availableBeds || totalBeds)
      await onSave({
        property_id: values.property_id, title: values.title, titleEn: values.titleEn || undefined,
        description: values.description || undefined, descriptionEn: values.descriptionEn || undefined,
        address: values.address, addressEn: values.addressEn || undefined, district: values.district,
        price: Number(values.price), currency: 'HKD', unit: '床位', status: values.status,
        available_at: values.available_at || 'now', occupation: totalBeds ? `${Math.max(0, Math.min(100, Math.round(((totalBeds - availableBeds) / totalBeds) * 100)))}%` : '0%',
        images, imageAlts, gender: values.gender, totalBeds, availableBeds,
        deposit: values.deposit ? Number(values.deposit) : undefined, otherFees: values.otherFees ? Number(values.otherFees) : undefined,
        minStayMonths: Number(values.minStayMonths || 1),
        location: { district: values.district, address: values.address, nearbyMTR: values.nearbyMTR.split(',').map((item) => item.trim()).filter(Boolean), coordinates: property?.location.coordinates || { lat: 22.3193, lng: 114.1694 } },
        details: { guests: totalBeds, bedrooms: 0, bathrooms: property?.details.bathrooms || 1, propertyType: 'Worker dormitory', roomType: 'shared room' },
        amenities: values.amenities.split(',').map((item) => item.trim()).filter(Boolean),
        availability: { available: values.status === 'active' && availableBeds > 0, minStay: Number(values.minStayMonths || 1) * 30, maxStay: 365 },
        policies: property?.policies || { checkIn: '', checkOut: '', cancellation: '' },
        host: property?.host || { id: 'admin', name: 'Labour Dorm', avatar: '', isSuperhost: false, responseTime: '' },
        rating: 0, reviewCount: 0,
      })
      await Promise.all(imagesPendingDeletion.map((url) => deletePropertyImage(url).catch(() => undefined)))
      setImagesPendingDeletion([])
      setNewlyUploadedImages([])
      setDirty(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '儲存失敗，請重試。')
    } finally { setSaving(false) }
  }

  const leave = () => {
    if (!dirty || window.confirm('有未儲存的變更，確定要離開嗎？')) {
      void Promise.all(newlyUploadedImages.map((url) => deletePropertyImage(url).catch(() => undefined)))
      onCancel()
    }
  }

  return <form onSubmit={submit} className="space-y-8" aria-describedby={error ? 'property-form-error' : undefined}>
    {error && <p id="property-form-error" role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-base font-semibold text-slate-900">基本資料</h3>
      <Input id="property-id" label="Property ID *" value={values.property_id} onChange={(event) => update('property_id', event.target.value)} />
      <Input id="district" label="地區 *" value={values.district} onChange={(event) => update('district', event.target.value)} placeholder="例如：旺角" />
      <Input id="title" label="中文名稱 *" value={values.title} onChange={(event) => update('title', event.target.value)} />
      <Input id="title-en" label="英文名稱" value={values.titleEn} onChange={(event) => update('titleEn', event.target.value)} />
      <Input id="address" label="中文地址 *" className="sm:col-span-2" value={values.address} onChange={(event) => update('address', event.target.value)} />
      <Input id="address-en" label="英文地址" className="sm:col-span-2" value={values.addressEn} onChange={(event) => update('addressEn', event.target.value)} />
      <TextArea id="description" label="中文描述" value={values.description} onChange={(value) => update('description', value)} />
      <TextArea id="description-en" label="英文描述" value={values.descriptionEn} onChange={(value) => update('descriptionEn', value)} />
    </section>
    <section className="grid gap-4 sm:grid-cols-2"><h3 className="sm:col-span-2 text-base font-semibold text-slate-900">租賃與床位</h3>
      <Input id="price" type="number" min="0" label="每月租金（HK$）*" value={values.price} onChange={(event) => update('price', event.target.value)} />
      <Input id="deposit" type="number" min="0" label="按金（HK$）" value={values.deposit} onChange={(event) => update('deposit', event.target.value)} />
      <Input id="total-beds" type="number" min="1" label="總床位 *" value={values.totalBeds} onChange={(event) => update('totalBeds', event.target.value)} />
      <Input id="available-beds" type="number" min="0" label="可用床位" value={values.availableBeds} onChange={(event) => update('availableBeds', event.target.value)} />
      <Select id="gender" label="指定性別" value={values.gender} onChange={(value) => update('gender', value)} options={[['any', '不限'], ['male', '男士'], ['female', '女士']]} />
      <Input id="available-at" type="date" label="最早入住日期（留空代表即日）" value={values.available_at} onChange={(event) => update('available_at', event.target.value)} />
      <Input id="min-stay" type="number" min="1" label="最短租期（月）" value={values.minStayMonths} onChange={(event) => update('minStayMonths', event.target.value)} />
      <Select id="status" label="發布狀態" value={values.status} onChange={(value) => update('status', value)} options={[['pending', '草稿'], ['active', '已發布'], ['inactive', '下架／封存']]} />
      <Input id="mtr" label="附近港鐵站" className="sm:col-span-2" value={values.nearbyMTR} onChange={(event) => update('nearbyMTR', event.target.value)} placeholder="以逗號分隔，例如：Mong Kok, Prince Edward" />
      <Input id="amenities" label="設施" className="sm:col-span-2" value={values.amenities} onChange={(event) => update('amenities', event.target.value)} placeholder="以逗號分隔，例如：wifi, aircon, laundry" />
    </section>
    <section><div className="mb-3 flex items-center justify-between gap-4"><div><h3 className="text-base font-semibold text-slate-900">圖片 *</h3><p className="mt-1 text-sm text-slate-600">JPG、PNG、WebP；每張最多 8MB。第一張會作為封面。</p></div><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"><ImagePlus className="h-4 w-4" />{uploading ? '上載中…' : '加入圖片'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={uploadImages} /></label></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={image} className="rounded-xl border border-slate-200 p-2"><img src={image} alt={imageAlts[index] || values.title || '房源圖片'} className="aspect-[4/3] w-full rounded-lg object-cover" /><div className="mt-2 flex items-center gap-1"><GripVertical className="h-4 w-4 text-slate-400" aria-hidden="true" /><input aria-label={`圖片 ${index + 1} alt text`} className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs" value={imageAlts[index] || ''} onChange={(event) => { const next = [...imageAlts]; next[index] = event.target.value; setImageAlts(next); setDirty(true) }} placeholder="圖片描述" /><button type="button" onClick={() => removeImage(index)} aria-label={`刪除圖片 ${index + 1}`} className="grid h-9 w-9 place-items-center rounded-lg text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
    </section>
    <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white py-4"><Button type="button" variant="outline" onClick={leave}>取消</Button><Button type="submit" variant="secondary" disabled={saving || uploading}>{saving ? '儲存中…' : '儲存房源'}</Button></div>
  </form>
}

function TextArea({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div><label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label><textarea id={id} rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-600" /></div>
}

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <div><label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600">{options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}</select></div>
}
