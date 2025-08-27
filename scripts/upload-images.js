const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env.local file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Function to upload a single image
async function uploadImage(imagePath, propertyId, filename) {
  try {
    console.log(`📤 Uploading ${filename} for ${propertyId}...`)
    
    // Read the image file
    const fileBuffer = fs.readFileSync(imagePath)
    
    // Generate storage path
    const storageKey = `properties/${propertyId}/${filename}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(storageKey, fileBuffer, {
        contentType: `image/${path.extname(filename).slice(1)}`,
        upsert: true // Overwrite if exists
      })
    
    if (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message)
      return null
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(storageKey)
    
    console.log(`✅ Uploaded ${filename} → ${publicUrlData.publicUrl}`)
    return publicUrlData.publicUrl
    
  } catch (error) {
    console.error(`❌ Error uploading ${filename}:`, error.message)
    return null
  }
}

// Function to process a property folder
async function processPropertyFolder(folderPath, propertyId) {
  try {
    console.log(`\n📁 Processing folder: ${propertyId}`)
    
    // Get all image files in the folder
    const files = fs.readdirSync(folderPath)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    )
    
    if (imageFiles.length === 0) {
      console.log(`⚠️  No image files found in ${propertyId}`)
      return []
    }
    
    console.log(`📊 Found ${imageFiles.length} images in ${propertyId}`)
    
    // Upload all images
    const uploadPromises = imageFiles.map(filename => {
      const imagePath = path.join(folderPath, filename)
      return uploadImage(imagePath, propertyId, filename)
    })
    
    const imageUrls = await Promise.all(uploadPromises)
    const validUrls = imageUrls.filter(url => url !== null)
    
    console.log(`✅ Successfully uploaded ${validUrls.length}/${imageFiles.length} images for ${propertyId}`)
    return validUrls
    
  } catch (error) {
    console.error(`❌ Error processing folder ${propertyId}:`, error.message)
    return []
  }
}

// Function to update property with image URLs
async function updatePropertyImages(propertyId, imageUrls) {
  try {
    console.log(`🔄 Updating database for ${propertyId} with ${imageUrls.length} images...`)
    
    const { error } = await supabase
      .from('properties')
      .update({ 
        images: imageUrls,
        image_url: imageUrls[0] || null // Set first image as featured image
      })
      .eq('property_id', propertyId)
    
    if (error) {
      console.error(`❌ Failed to update ${propertyId}:`, error.message)
      return false
    }
    
    console.log(`✅ Updated database for ${propertyId}`)
    return true
    
  } catch (error) {
    console.error(`❌ Error updating ${propertyId}:`, error.message)
    return false
  }
}

// Main function
async function uploadAllImages() {
  try {
    console.log('🚀 Starting image upload process...')
    
    const imagesBasePath = '/Users/kazaf/Desktop/img'
    
    // Check if base path exists
    if (!fs.existsSync(imagesBasePath)) {
      console.error(`❌ Images directory not found: ${imagesBasePath}`)
      process.exit(1)
    }
    
    // Get all property folders
    const folders = fs.readdirSync(imagesBasePath)
      .filter(item => {
        const fullPath = path.join(imagesBasePath, item)
        return fs.statSync(fullPath).isDirectory()
      })
    
    console.log(`📊 Found ${folders.length} property folders:`, folders)
    
    let totalSuccess = 0
    let totalFailed = 0
    
    // Process each folder
    for (const folder of folders) {
      const folderPath = path.join(imagesBasePath, folder)
      
      // Handle folder name mapping: drom-xxx → dorm-xxx
      let propertyId = folder
      if (folder.startsWith('drom-')) {
        propertyId = folder.replace('drom-', 'dorm-')
        console.log(`🔄 Mapping folder ${folder} → property_id ${propertyId}`)
      }
      
      // Check if property exists in database
      const { data: property, error } = await supabase
        .from('properties')
        .select('id, property_id, title')
        .eq('property_id', propertyId)
        .single()
      
      if (error || !property) {
        console.log(`⚠️  Property ${propertyId} not found in database, skipping...`)
        totalFailed++
        continue
      }
      
      console.log(`✅ Found property: ${property.title} (${propertyId})`)
      
      // Upload images for this property
      const imageUrls = await processPropertyFolder(folderPath, propertyId)
      
      if (imageUrls.length > 0) {
        // Update database with image URLs
        const updated = await updatePropertyImages(propertyId, imageUrls)
        if (updated) {
          totalSuccess++
        } else {
          totalFailed++
        }
      } else {
        console.log(`⚠️  No images uploaded for ${propertyId}`)
        totalFailed++
      }
    }
    
    console.log('\n🎉 Image upload process completed!')
    console.log(`✅ Successfully processed: ${totalSuccess} properties`)
    console.log(`❌ Failed/Skipped: ${totalFailed} properties`)
    
    // Show final summary
    const { data: allProperties, error } = await supabase
      .from('properties')
      .select('property_id, title, images')
      .not('images', 'is', null)
      .neq('images', '{}')
    
    if (allProperties) {
      console.log(`\n📈 Properties with images: ${allProperties.length}`)
      allProperties.forEach(prop => {
        console.log(`  - ${prop.property_id}: ${prop.images.length} images`)
      })
    }
    
  } catch (error) {
    console.error('💥 Upload process failed:', error.message)
    process.exit(1)
  }
}

// Run the upload
uploadAllImages()
  .then(() => {
    console.log('🎉 Upload completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Upload failed:', error.message)
    process.exit(1)
  })