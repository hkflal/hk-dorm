const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testStorage() {
  console.log('🧪 Testing Supabase Storage...')
  
  try {
    // List buckets
    console.log('📂 Checking buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message)
      return
    }
    
    console.log('✅ Buckets found:', buckets.map(b => `${b.name} (public: ${b.public})`))
    
    // Check if property-images bucket exists and is public
    const propertyBucket = buckets.find(b => b.name === 'property-images')
    
    if (!propertyBucket) {
      console.log('🔧 Creating property-images bucket...')
      const { data, error } = await supabase.storage.createBucket('property-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (error) {
        console.error('❌ Failed to create bucket:', error.message)
        return
      }
      
      console.log('✅ Created property-images bucket')
    } else if (!propertyBucket.public) {
      console.log('🔧 Making property-images bucket public...')
      const { error } = await supabase.storage.updateBucket('property-images', {
        public: true
      })
      
      if (error) {
        console.error('❌ Failed to make bucket public:', error.message)
      } else {
        console.log('✅ Made property-images bucket public')
      }
    } else {
      console.log('✅ property-images bucket is already public')
    }
    
    // List files in the bucket
    console.log('\n📁 Checking files in property-images bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('property-images')
      .list('properties', { limit: 5 })
    
    if (filesError) {
      console.error('❌ Error listing files:', filesError.message)
    } else {
      console.log('📄 Found folders:', files.map(f => f.name))
      
      if (files.length > 0) {
        // Get files from first folder
        const { data: subFiles, error: subError } = await supabase.storage
          .from('property-images')
          .list(`properties/${files[0].name}`, { limit: 3 })
        
        if (!subError && subFiles.length > 0) {
          console.log(`📷 Sample images in ${files[0].name}:`, subFiles.map(f => f.name))
          
          // Test public URL generation
          const testPath = `properties/${files[0].name}/${subFiles[0].name}`
          const { data: publicUrl } = supabase.storage
            .from('property-images')
            .getPublicUrl(testPath)
          
          console.log(`🔗 Sample public URL: ${publicUrl.publicUrl}`)
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
  }
}

testStorage()
  .then(() => console.log('🏁 Storage test completed'))
  .catch(err => console.error('💥 Test error:', err.message))