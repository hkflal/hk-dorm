const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { enhancedProperties } = require('../src/lib/enhanced-data.ts')

const projectId = 'hk-dormitory-hub'
const databaseId = '(default)'
const apiRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents`
const resourceRoot = `projects/${projectId}/databases/${databaseId}/documents`
const approvalFlag = process.env.FIREBASE_PRODUCTION_WRITE_APPROVED === 'true'
const manifestPath = process.argv[2] || path.join('backups', '2026-08-13-production-post-migration.json')

function fail(message) {
  throw new Error(message)
}

function getAccessToken() {
  const result = spawnSync('npx', ['firebase', 'login:list', '--json'], { encoding: 'utf8' })
  if (result.status !== 0) fail('Firebase CLI login is unavailable.')
  const payload = JSON.parse(result.stdout)
  const token = payload.result?.[0]?.tokens?.access_token
  if (!token) fail('Firebase CLI did not return an access token.')
  return token
}

function firestoreValue(value, key) {
  if (value === null) return { nullValue: 'NULL_VALUE' }
  if (typeof value === 'string') {
    if (['createdAt', 'updatedAt', 'publishedAt'].includes(key) && !Number.isNaN(Date.parse(value))) {
      return { timestampValue: new Date(value).toISOString() }
    }
    return { stringValue: value }
  }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (typeof value === 'number') return Number.isInteger(value)
    ? { integerValue: String(value) }
    : { doubleValue: value }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map((item) => firestoreValue(item, '')).filter(Boolean) } }
  }
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([field, item]) => [field, firestoreValue(item, field)])),
      },
    }
  }
  return undefined
}

function firestoreFields(property) {
  const { id, ...storedProperty } = property
  return Object.fromEntries(
    Object.entries(storedProperty)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, firestoreValue(value, key)]),
  )
}

async function request(url, options = {}) {
  const response = await fetch(url, options)
  const body = await response.text()
  let parsed
  try { parsed = body ? JSON.parse(body) : {} } catch { parsed = { raw: body } }
  if (!response.ok) fail(`Firestore API ${response.status}: ${parsed.error?.message || body}`)
  return parsed
}

async function listProperties(token) {
  const documents = []
  let pageToken = ''
  do {
    const query = new URL(`${apiRoot}/properties`)
    query.searchParams.set('pageSize', '100')
    if (pageToken) query.searchParams.set('pageToken', pageToken)
    const page = await request(query, { headers: { Authorization: `Bearer ${token}` } })
    documents.push(...(page.documents || []))
    pageToken = page.nextPageToken || ''
  } while (pageToken)
  return documents
}

async function main() {
  if (!approvalFlag) fail('Refusing production migration without FIREBASE_PRODUCTION_WRITE_APPROVED=true.')
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') fail('Refusing production migration while Firebase emulator mode is enabled.')
  if (enhancedProperties.length !== 15) fail(`Expected 15 reviewed properties, found ${enhancedProperties.length}.`)

  const token = getAccessToken()
  const existing = await listProperties(token)
  if (existing.length > 0) fail(`Production properties collection is not empty (${existing.length} documents); no overwrite performed.`)

  const writes = enhancedProperties.map((property) => ({
    update: {
      name: `${resourceRoot}/properties/${encodeURIComponent(property.id)}`,
      fields: firestoreFields(property),
    },
  }))
  const result = await request(`${apiRoot}:batchWrite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  })
  const failures = (result.status || []).filter((status) => status.code)
  if (failures.length) fail(`Production migration returned ${failures.length} failed writes.`)

  const after = await listProperties(token)
  const expectedIds = enhancedProperties.map((property) => property.id).sort()
  const actualIds = after.map((document) => document.name.split('/').pop()).sort()
  if (after.length !== enhancedProperties.length || JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    fail(`Production read-back mismatch: expected ${enhancedProperties.length} documents, found ${after.length}.`)
  }

  const manifest = {
    backupType: 'labour-dorm-production-migration-readback',
    generatedAt: new Date().toISOString(),
    projectId,
    firestoreDatabase: databaseId,
    sourceBackup: 'backups/2026-08-13-production-preflight.json',
    migratedCount: after.length,
    documentIds: actualIds,
    documents: after.map((document) => ({
      name: document.name,
      fields: Object.keys(document.fields || {}).sort(),
      status: document.fields?.status?.stringValue || null,
      propertyId: document.fields?.property_id?.stringValue || null,
      imageCount: document.fields?.images?.arrayValue?.values?.length || 0,
    })),
  }
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ migratedCount: after.length, manifestPath, documentIds: actualIds }))
}

main().catch((error) => {
  console.error(`Production Firestore migration failed: ${error.message}`)
  process.exitCode = 1
})
