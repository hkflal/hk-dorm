const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env.local file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

// Use service role key for migration if available, otherwise anon key
const keyToUse = supabaseServiceKey || supabaseAnonKey
const supabase = createClient(supabaseUrl, keyToUse)

if (supabaseServiceKey) {
  console.log('🔑 Using service role key for migration (bypasses RLS)')
} else {
  console.log('🔑 Using anon key - make sure RLS is disabled for migration')
}

// Default coordinates for Hong Kong districts
const districtCoordinates = {
  '旺角': { lat: 22.3193, lng: 114.1694 },
  '尖沙咀': { lat: 22.2987, lng: 114.1719 },
  '銅鑼灣': { lat: 22.2798, lng: 114.1859 },
  '中環': { lat: 22.2783, lng: 114.1747 },
  '佐敦': { lat: 22.3053, lng: 114.1717 },
  '長沙灣': { lat: 22.3378, lng: 114.1497 },
  '灣仔': { lat: 22.2783, lng: 114.1722 }
}

// Parse amenities string to array
const parseAmenities = (amenitiesStr) => {
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

// Convert CSV row to Supabase format
const csvToSupabase = (row) => {
  const coordinates = districtCoordinates[row.district] || { lat: 22.2783, lng: 114.1747 }
  
  // Handle BOM in CSV header - first column might be ﻿type instead of type
  const propertyType = row.type || row['﻿type']
  
  return {
    property_id: row.property_id,
    type: propertyType,
    title: row.title || row.address,
    subtitle: row.subtitle || `${propertyType}在${row.district}`,
    description: row.description || `位於${row.district}的${propertyType}，${row['room type']}，月租HK$${row.price}`,
    address: row.address,
    district: row.district,
    price: parseInt(row.price) || 0,
    currency: 'HKD',
    unit: row.unit,
    status: row.status === 'active' ? 'active' : row.status === 'pending' ? 'pending' : 'inactive',
    available_at: row.available_at || 'now',
    occupation: row['occupation '] || row.occupation || '0%',
    images: row.image_url ? [row.image_url] : [],
    image_url: row.image_url || null,
    vr: row.vr || null,
    rating: 4.0,
    review_count: 0,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    nearby_mtr: [],
    guests: row['room type'] === 'shared room' ? 1 : 2,
    bedrooms: row.unit === '套房' ? 1 : 0,
    bathrooms: row.unit === '套房' ? 1 : 0,
    property_type: propertyType,
    room_type: row['room type'],
    amenities: parseAmenities(row.amenities || row['amenities ']),
    host_id: 'admin-host',
    host_name: 'HKFLAL Admin',
    host_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    host_is_superhost: true,
    host_response_time: '1 hour',
    available: row.status === 'active',
    min_stay: 30,
    max_stay: 365,
    check_in: '2:00 PM',
    check_out: '12:00 PM',
    cancellation: 'Flexible'
  }
}

// Main migration function
async function migrateData() {
  try {
    console.log('🚀 Starting Supabase data migration...')
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'listing.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found:', csvPath)
      console.error('Please make sure listing.csv exists in the project root')
      process.exit(1)
    }
    
    const csvData = fs.readFileSync(csvPath, 'utf-8')
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    
    console.log(`📊 Found ${records.length} records in CSV`)
    
    // Convert CSV records to Supabase format
    const properties = records.map(csvToSupabase)
    
    console.log('🔄 Converting CSV data to Supabase format...')
    console.log(`📝 Sample property:`, JSON.stringify(properties[0], null, 2))
    
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message)
      console.error('Please check your Supabase configuration and database schema')
      process.exit(1)
    }
    
    console.log(`✅ Supabase connected! Current properties in database: ${testData?.length || 0}`)
    
    // Clear existing data to avoid duplicates
    console.log('🧹 Clearing existing properties...')
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000') // Delete all records
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 = no rows found (ok)
      console.error('❌ Failed to clear existing data:', deleteError.message)
      // Continue anyway - might be no data to clear
    } else {
      console.log('✅ Existing data cleared')
    }
    
    // Insert properties in batches
    console.log('☁️  Uploading properties to Supabase...')
    
    const batchSize = 10
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('properties')
        .insert(batch)
      
      if (error) {
        console.error(`❌ Failed to insert batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        throw error
      }
      
      console.log(`✅ Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)} (${batch.length} properties)`)
    }
    
    console.log('✅ Data migration completed successfully!')
    console.log(`📈 Migrated ${properties.length} properties to Supabase`)
    
    // Verify final count
    const { count: finalCount, error: countError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
    
    if (!countError) {
      console.log(`🎉 Final database count: ${finalCount} properties`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('🎉 Migration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  })