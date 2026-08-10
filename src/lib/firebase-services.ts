import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query,
  serverTimestamp, updateDoc, where,
} from 'firebase/firestore'
import {
  deleteObject, getDownloadURL, ref, uploadBytes,
} from 'firebase/storage'
import { db, storage } from './firebase'
import { enhancedProperties } from './enhanced-data'
import { isIndexableProperty } from './property-visibility'
import { Property } from './types'

const propertiesCollection = collection(db, 'properties')
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxImageBytes = 8 * 1024 * 1024
const staticPublicProperties = enhancedProperties.filter(isIndexableProperty)
const firebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
)
const firestoreEmulatorEnabled = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  || process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true'
const storageEmulatorEnabled = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  || process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === 'true'
const authEmulatorEnabled = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  || process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true'
const localAdminStoreEnabled = !firebaseConfigured && !firestoreEmulatorEnabled && authEmulatorEnabled
const localAdminDatabaseName = 'labour-dorm-local-admin'
const localAdminStoreName = 'data'
const localAdminPropertiesKey = 'properties'
let memoryAdminProperties: Property[] | null = null

export const adminDataMode: 'firebase' | 'local' | 'readonly' = firebaseConfigured || firestoreEmulatorEnabled
  ? 'firebase'
  : localAdminStoreEnabled
    ? 'local'
    : 'readonly'
export const adminWritesAvailable = adminDataMode !== 'readonly'

function requireAdminWrites() {
  if (!adminWritesAvailable) {
    throw new Error('本地 Firestore 測試資料庫尚未啟動，現有房源目前只供檢視。')
  }
}

function openLocalAdminDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(localAdminDatabaseName, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(localAdminStoreName)) {
        request.result.createObjectStore(localAdminStoreName)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('未能開啟本地測試資料庫。'))
  })
}

async function readLocalAdminProperties(): Promise<Property[]> {
  if (typeof window === 'undefined') return [...enhancedProperties]
  try {
    const database = await openLocalAdminDatabase()
    const properties = await new Promise<Property[] | undefined>((resolve, reject) => {
      const request = database.transaction(localAdminStoreName, 'readonly')
        .objectStore(localAdminStoreName)
        .get(localAdminPropertiesKey)
      request.onsuccess = () => resolve(request.result as Property[] | undefined)
      request.onerror = () => reject(request.error)
    })
    database.close()
    if (Array.isArray(properties)) {
      memoryAdminProperties = properties
      return properties
    }
  } catch {
    // Some embedded browsers can restrict persistent storage. Keep a
    // session-memory fallback so localhost editing still remains usable.
  }
  return memoryAdminProperties || [...enhancedProperties]
}

async function writeLocalAdminProperties(properties: Property[]) {
  memoryAdminProperties = properties
  if (typeof window === 'undefined') return
  try {
    const database = await openLocalAdminDatabase()
    await new Promise<void>((resolve, reject) => {
      const request = database.transaction(localAdminStoreName, 'readwrite')
        .objectStore(localAdminStoreName)
        .put(properties, localAdminPropertiesKey)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    database.close()
  } catch {
    // The in-memory copy remains available for this localhost session.
  }
}

export async function resetLocalAdminProperties() {
  if (!localAdminStoreEnabled) return
  await writeLocalAdminProperties(enhancedProperties)
}

function asIso(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString()
  }
  return new Date().toISOString()
}

function fromFirestore(snapshot: Awaited<ReturnType<typeof getDoc>>): Property {
  const data = snapshot.data() as Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: unknown; updatedAt?: unknown }
  return {
    ...data,
    id: snapshot.id,
    createdAt: asIso(data.createdAt),
    updatedAt: asIso(data.updatedAt),
  } as Property
}

function toFirestore(data: Partial<Property>) {
  const { id, createdAt, updatedAt, rating, reviewCount, host, ...safeData } = data
  return { ...safeData, updatedAt: serverTimestamp() }
}

async function writeAudit(action: string, propertyId: string, details: Record<string, unknown> = {}) {
  await addDoc(collection(db, 'auditLogs'), {
    action, propertyId, details, createdAt: serverTimestamp(),
  })
}

export async function getAdminProperties(): Promise<Property[]> {
  if (localAdminStoreEnabled) {
    return await readLocalAdminProperties()
  }

  if (adminDataMode === 'readonly') {
    return [...enhancedProperties]
  }

  try {
    const snapshot = await getDocs(query(propertiesCollection, orderBy('updatedAt', 'desc')))
    const properties = snapshot.docs.map((item) => fromFirestore(item))
    return properties.length > 0 || firebaseConfigured
      ? properties
      : [...enhancedProperties]
  } catch (error) {
    if (firestoreEmulatorEnabled) return [...enhancedProperties]
    throw error
  }
}

/**
 * Public listings are read directly by the client so a newly published listing
 * can appear in the catalogue without waiting for the next static export.
 * Detail pages and sitemap entries remain generated at deploy time for SEO.
 *
 * The homepage is statically rendered with the same catalogue. Keep that
 * catalogue when Firebase is not configured, unavailable, or empty: returning
 * an empty array would otherwise replace valid static listings in the client.
 */
export async function getPublicProperties(): Promise<Property[]> {
  if (localAdminStoreEnabled) {
    return (await readLocalAdminProperties()).filter(isIndexableProperty)
  }

  const firebaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  )
  const emulatorEnabled = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'

  if (!firebaseConfigured && !emulatorEnabled) return [...staticPublicProperties]

  try {
    const snapshot = await getDocs(query(propertiesCollection, where('status', '==', 'active'), orderBy('updatedAt', 'desc')))
    const remoteProperties = snapshot.docs
      .map((item) => fromFirestore(item))
      .filter((property) => (
        property.status === 'active'
        && Array.isArray(property.images)
        && property.images.length > 0
      ))

    return remoteProperties.length > 0
      ? remoteProperties
      : [...staticPublicProperties]
  } catch {
    return [...staticPublicProperties]
  }
}

export async function createProperty(data: Partial<Property>): Promise<string> {
  requireAdminWrites()
  if (localAdminStoreEnabled) {
    const now = new Date().toISOString()
    const id = `local-${crypto.randomUUID()}`
    await writeLocalAdminProperties([
      {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      } as Property,
      ...await readLocalAdminProperties(),
    ])
    return id
  }

  const result = await addDoc(propertiesCollection, {
    ...toFirestore(data),
    createdAt: serverTimestamp(),
  })
  await writeAudit('property.created', result.id, { propertyId: data.property_id })
  return result.id
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<void> {
  requireAdminWrites()
  if (localAdminStoreEnabled) {
    const properties = await readLocalAdminProperties()
    const index = properties.findIndex((property) => property.id === id)
    if (index < 0) throw new Error('找不到要編輯的本地房源。')
    properties[index] = {
      ...properties[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    }
    await writeLocalAdminProperties(properties)
    return
  }

  await updateDoc(doc(db, 'properties', id), toFirestore(data))
  await writeAudit('property.updated', id, { propertyId: data.property_id })
}

export async function setPropertyPublished(id: string, published: boolean): Promise<void> {
  const status: Property['status'] = published ? 'active' : 'pending'
  await updateProperty(id, {
    status,
    publishedAt: published ? new Date().toISOString() : undefined,
  })
}

export async function archiveProperty(id: string): Promise<void> {
  requireAdminWrites()
  if (localAdminStoreEnabled) {
    await updateProperty(id, { status: 'inactive' })
    return
  }

  await updateDoc(doc(db, 'properties', id), { status: 'inactive', updatedAt: serverTimestamp() })
  await writeAudit('property.archived', id)
}

export async function deletePropertyPermanently(id: string): Promise<void> {
  requireAdminWrites()
  if (localAdminStoreEnabled) {
    await writeLocalAdminProperties((await readLocalAdminProperties()).filter((property) => property.id !== id))
    return
  }

  const snapshot = await getDoc(doc(db, 'properties', id))
  if (!snapshot.exists()) return
  const property = fromFirestore(snapshot)
  await Promise.all(property.images.map((url) => deletePropertyImage(url).catch(() => undefined)))
  await deleteDoc(snapshot.ref)
  await writeAudit('property.deleted', id, { propertyId: property.property_id, images: property.images.length })
}

export async function uploadPropertyImage(file: File, propertyKey: string): Promise<string> {
  if (!firebaseConfigured && !storageEmulatorEnabled && !localAdminStoreEnabled) {
    throw new Error('本地 Storage Emulator 尚未啟動，暫時不能上載圖片。')
  }
  if (!allowedImageTypes.includes(file.type)) throw new Error('只支援 JPG、PNG 或 WebP 圖片。')
  if (file.size > maxImageBytes) throw new Error('每張圖片不能超過 8MB。')
  const optimised = await optimiseImage(file)
  if (localAdminStoreEnabled) {
    const dataUrl = await blobToDataUrl(optimised)
    if (dataUrl.length > 1_500_000) {
      throw new Error('本地測試圖片壓縮後仍太大，請使用較小的圖片。')
    }
    return dataUrl
  }

  const safeKey = propertyKey.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/^-+|-+$/g, '') || 'new-property'
  const imageRef = ref(storage, `properties/${safeKey}/${crypto.randomUUID()}.webp`)
  const upload = await uploadBytes(imageRef, optimised, { contentType: 'image/webp' })
  return getDownloadURL(upload.ref)
}

async function optimiseImage(file: File): Promise<Blob> {
  if (typeof window === 'undefined') return file
  const source = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = reject
      element.src = source
    })
    const maxEdge = 1600
    const ratio = Math.min(1, maxEdge / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * ratio))
    canvas.height = Math.max(1, Math.round(image.height * ratio))
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('圖片壓縮失敗。')), 'image/webp', 0.82))
  } finally { URL.revokeObjectURL(source) }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('未能讀取本地測試圖片。'))
    reader.onerror = () => reject(new Error('未能讀取本地測試圖片。'))
    reader.readAsDataURL(blob)
  })
}

export async function deletePropertyImage(url: string): Promise<void> {
  if (url.startsWith('data:')) return
  if (!url.includes('firebasestorage.googleapis.com')) return
  await deleteObject(ref(storage, url))
}

export function getAdminStats(properties: Property[]) {
  return {
    total: properties.length,
    published: properties.filter((property) => property.status === 'active').length,
    drafts: properties.filter((property) => property.status === 'pending').length,
    archived: properties.filter((property) => property.status === 'inactive').length,
  }
}
