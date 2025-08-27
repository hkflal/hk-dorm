#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import { createPropertiesBatch } from '../src/lib/supabase-services'
import { Property } from '../src/lib/types'

// Supabase configuration is handled in the supabase.ts file
// No additional setup needed here

// Default coordinates for Hong Kong districts
const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  '旺角': { lat: 22.3193, lng: 114.1694 },
  '尖沙咀': { lat: 22.2987, lng: 114.1719 },
  '銅鑼灣': { lat: 22.2798, lng: 114.1859 },
  '中環': { lat: 22.2783, lng: 114.1747 },
  '佐敦': { lat: 22.3053, lng: 114.1717 },
  '長沙灣': { lat: 22.3378, lng: 114.1497 },
  '灣仔': { lat: 22.2783, lng: 114.1722 }
}

// Parse amenities string to array
const parseAmenities = (amenitiesStr: string): string[] => {
  try {
    if (!amenitiesStr || amenitiesStr.trim() === '') return []
    
    // Remove brackets and quotes, split by comma
    const cleaned = amenitiesStr
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    return cleaned
  } catch (error) {
    console.warn('Failed to parse amenities:', amenitiesStr, error)
    return []
  }
}

// Convert CSV row to Property object
const csvToProperty = (row: any): Partial<Property> => {
  const coordinates = districtCoordinates[row.district] || { lat: 22.2783, lng: 114.1747 }
  
  return {
    property_id: row.property_id,
    type: row.type,
    title: row.title || row.address, // Use address as title if title is empty
    subtitle: row.subtitle || `${row.type}在${row.district}`,
    description: row.description || `位於${row.district}的${row.type}，${row['room type']}，月租HK$${row.price}`,
    address: row.address,
    district: row.district,
    price: parseInt(row.price) || 0,
    currency: 'HKD',
    unit: row.unit,
    status: row.status === 'active' ? 'active' : row.status === 'pending' ? 'pending' : 'inactive',
    available_at: row.available_at || 'now',
    occupation: row['occupation '] || row.occupation || '0%', // Handle extra space in CSV header
    images: row.image_url ? [row.image_url] : [],
    image_url: row.image_url || '',
    vr: row.vr || '',
    rating: 4.0, // Default rating
    reviewCount: 0, // Default review count
    location: {
      district: row.district,
      address: row.address,
      nearbyMTR: [], // Will be populated based on district
      coordinates
    },
    details: {
      guests: row['room type'] === 'shared room' ? 1 : 2,
      bedrooms: row.unit === '套房' ? 1 : 0,
      bathrooms: row.unit === '套房' ? 1 : 0,
      propertyType: row.type,
      roomType: row['room type']
    },
    amenities: parseAmenities(row.amenities || row['amenities ']), // Handle extra space
    host: {
      id: 'admin-host',
      name: 'HKFLAL Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
      responseTime: '1 hour'
    },
    availability: {
      available: row.status === 'active',
      minStay: 30, // Default minimum stay in days
      maxStay: 365 // Default maximum stay in days
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Flexible'
    }
  }
}

// Main migration function
async function migrateData() {
  try {
    console.log('🚀 Starting data migration...')
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'listing.csv')
    const csvData = fs.readFileSync(csvPath, 'utf-8')
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    
    console.log(`📊 Found ${records.length} records in CSV`)
    
    // Convert CSV records to Property objects
    const properties: Partial<Property>[] = records.map(csvToProperty)
    
    console.log('🔄 Converting CSV data to Property objects...')
    console.log(`📝 Sample property:`, JSON.stringify(properties[0], null, 2))
    
    // Batch create properties in Supabase
    console.log('☁️  Uploading properties to Supabase...')
    await createPropertiesBatch(properties)
    
    console.log('✅ Data migration completed successfully!')
    console.log(`📈 Migrated ${properties.length} properties to Supabase`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('🎉 Migration completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { migrateData }