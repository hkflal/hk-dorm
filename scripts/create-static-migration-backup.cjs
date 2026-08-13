const fs = require('node:fs')
const path = require('node:path')
const { enhancedProperties } = require('../src/lib/enhanced-data.ts')

const destination = process.argv[2] || path.join('backups', '2026-08-13-production-preflight.json')
const backup = {
  backupType: 'labour-dorm-production-migration-preflight',
  generatedAt: new Date().toISOString(),
  projectId: 'hk-dormitory-hub',
  firestoreDatabase: {
    databaseId: '(default)',
    existsBeforeMigration: false,
    databasesBeforeMigration: [],
  },
  source: 'src/lib/enhanced-data.ts',
  sourceDescription: 'Reviewed static catalogue used by the public site before production Firestore was enabled.',
  propertyCount: enhancedProperties.length,
  statusCounts: enhancedProperties.reduce((counts, property) => {
    counts[property.status] = (counts[property.status] || 0) + 1
    return counts
  }, {}),
  imageBackedCount: enhancedProperties.filter((property) => property.images.length > 0).length,
  properties: enhancedProperties,
}

fs.mkdirSync(path.dirname(destination), { recursive: true })
fs.writeFileSync(destination, `${JSON.stringify(backup, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ destination, propertyCount: backup.propertyCount, statusCounts: backup.statusCounts, imageBackedCount: backup.imageBackedCount }))
