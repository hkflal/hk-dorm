const { File } = require('node:buffer')
const { connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth')
const { collection, connectFirestoreEmulator, getDocs, query, where } = require('firebase/firestore')
const { connectStorageEmulator } = require('firebase/storage')
const { auth, db, storage } = require('../src/lib/firebase.ts')
const {
  archiveProperty,
  createProperty,
  deletePropertyPermanently,
  getAdminProperties,
  getPublicProperties,
  setPropertyPublished,
  updateProperty,
  uploadPropertyImage,
} = require('../src/lib/firebase-services.ts')

const localProjectId = 'labour-dorm-local'
const adminEmail = 'hkdl902@gmail.com'
const adminPassword = process.env.LOCAL_ADMIN_TEST_PASSWORD || 'local-test-password'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function makeProperty(propertyId) {
  return {
    property_id: propertyId,
    type: '勞工舍宿',
    title: `Emulator test ${propertyId}`,
    description: 'Temporary emulator-only listing.',
    descriptionEn: undefined,
    address: 'Emulator test address',
    district: '旺角',
    price: 2800,
    currency: 'HKD',
    unit: '床位',
    status: 'pending',
    available_at: 'now',
    occupation: '0%',
    images: [],
    imageAlts: [],
    rating: 0,
    reviewCount: 0,
    gender: 'any',
    totalBeds: 2,
    availableBeds: 2,
    location: {
      district: '旺角',
      address: 'Emulator test address',
      nearbyMTR: ['Mong Kok'],
      coordinates: { lat: 22.3193, lng: 114.1694 },
    },
    details: {
      guests: 2,
      bedrooms: 0,
      bathrooms: 1,
      propertyType: 'Worker dormitory',
      roomType: 'shared room',
    },
    amenities: ['wifi'],
    host: {
      id: 'admin',
      name: 'Labour Dorm',
      avatar: '',
      isSuperhost: false,
      responseTime: '',
    },
    availability: { available: false, minStay: 30, maxStay: 365 },
    policies: { checkIn: '', checkOut: '', cancellation: '' },
    titleEn: undefined,
    addressEn: undefined,
    publishedAt: undefined,
  }
}

async function signInAdmin() {
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
  } catch (error) {
    if (error?.code !== 'auth/user-not-found' && error?.code !== 'auth/invalid-credential') throw error
    await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
  }
}

async function findAdminProperty(propertyId) {
  return (await getAdminProperties()).find((property) => property.property_id === propertyId)
}

async function main() {
  assert(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true', 'Refusing to run without Firebase emulators enabled.')
  assert(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === localProjectId, 'Refusing to run against a non-local Firebase project.')

  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)

  const propertyIds = []
  await signInAdmin()

  try {
    const initiallyEmpty = await getAdminProperties()
    assert(Array.isArray(initiallyEmpty), 'A reachable empty Firestore collection must return an array.')

    const propertyId = `e2e-admin-${Date.now()}`
    const createdId = await createProperty(makeProperty(propertyId))
    propertyIds.push(createdId)

    let property = await findAdminProperty(propertyId)
    assert(property?.status === 'pending', 'A new listing must be readable as a draft.')
    assert(property?.descriptionEn === undefined, 'Blank optional fields should not be stored as undefined values.')

    const pngBytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
    const imageUrl = await uploadPropertyImage(new File([pngBytes], 'emulator-test.png', { type: 'image/png' }), propertyId)
    assert(imageUrl.includes('/properties%2F') || imageUrl.includes('/properties/'), 'Uploaded image must be stored below the properties path.')
    const imageResponse = await fetch(imageUrl)
    assert(imageResponse.ok, `Uploaded image URL must be readable; received HTTP ${imageResponse.status}.`)

    await updateProperty(createdId, {
      title: 'Emulator test edited',
      price: 2950,
      availableBeds: 1,
      images: [imageUrl],
      imageAlts: ['Emulator test image'],
    })
    property = await findAdminProperty(propertyId)
    assert(property?.title === 'Emulator test edited', 'Admin edit must persist the title.')
    assert(property?.price === 2950 && property?.availableBeds === 1, 'Admin edit must persist numeric fields.')

    await setPropertyPublished(createdId, true)
    await signOut(auth)
    let publicProperties = await getPublicProperties()
    assert(publicProperties.some((item) => item.property_id === propertyId), 'An active image-backed listing must be publicly readable.')

    await signInAdmin()
    await setPropertyPublished(createdId, false)
    await signOut(auth)
    publicProperties = await getPublicProperties()
    assert(!publicProperties.some((item) => item.property_id === propertyId), 'A hidden listing must disappear from the anonymous public query.')

    await signInAdmin()
    property = await findAdminProperty(propertyId)
    assert(property?.status === 'pending', 'A hidden listing must remain available to the admin for republishing.')
    await setPropertyPublished(createdId, true)
    await archiveProperty(createdId)
    property = await findAdminProperty(propertyId)
    assert(property?.status === 'inactive', 'Archive must make a listing inactive.')

    await deletePropertyPermanently(createdId)
    propertyIds.pop()
    const afterDelete = await getAdminProperties()
    assert(!afterDelete.some((item) => item.property_id === propertyId), 'Permanent delete must remove the property document.')

    const auditSnapshot = await getDocs(query(collection(db, 'auditLogs'), where('propertyId', '==', createdId)))
    assert(auditSnapshot.size >= 4, 'Create, edit, publish/hide and delete operations must leave an audit trail.')

    const secondPropertyId = `e2e-empty-${Date.now()}`
    const secondCreatedId = await createProperty(makeProperty(secondPropertyId))
    propertyIds.push(secondCreatedId)
    assert(await findAdminProperty(secondPropertyId), 'A reachable empty collection must allow the first subsequent create.')
    await deletePropertyPermanently(secondCreatedId)
    propertyIds.pop()

    console.log('Firebase admin emulator CRUD, Storage upload, publish/hide, archive, delete and empty-collection checks passed.')
  } finally {
    await signInAdmin().catch(() => undefined)
    for (const propertyId of propertyIds) {
      await deletePropertyPermanently(propertyId).catch(() => undefined)
    }
    await signOut(auth).catch(() => undefined)
  }
}

main().catch((error) => {
  console.error(`Firebase admin emulator test failed: ${error.message}`)
  process.exitCode = 1
})
