import { supabase } from './supabase'
import { Database } from './database.types'
import { Property } from './types'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

// Convert Supabase row to Property interface
const supabaseToProperty = (row: PropertyRow): Property => {
  return {
    id: row.id,
    property_id: row.property_id,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    address: row.address,
    district: row.district,
    price: row.price,
    currency: row.currency,
    unit: row.unit,
    status: row.status,
    available_at: row.available_at,
    occupation: row.occupation,
    images: row.images || [],
    image_url: row.image_url,
    vr: row.vr,
    rating: row.rating,
    reviewCount: row.review_count,
    location: {
      district: row.district,
      address: row.address,
      nearbyMTR: row.nearby_mtr || [],
      coordinates: {
        lat: row.latitude,
        lng: row.longitude
      }
    },
    details: {
      guests: row.guests,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      propertyType: row.property_type || row.type,
      roomType: row.room_type
    },
    amenities: row.amenities || [],
    host: {
      id: row.host_id,
      name: row.host_name,
      avatar: row.host_avatar || '',
      isSuperhost: row.host_is_superhost,
      responseTime: row.host_response_time
    },
    availability: {
      available: row.available,
      minStay: row.min_stay,
      maxStay: row.max_stay
    },
    policies: {
      checkIn: row.check_in,
      checkOut: row.check_out,
      cancellation: row.cancellation
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Convert Property to Supabase insert format
const propertyToSupabaseInsert = (property: Partial<Property>): PropertyInsert => {
  return {
    property_id: property.property_id!,
    type: property.type as '勞工舍宿' | '學生宿舍',
    title: property.title!,
    subtitle: property.subtitle,
    description: property.description,
    address: property.address!,
    district: property.district!,
    price: property.price!,
    currency: property.currency || 'HKD',
    unit: property.unit as '床位' | '套房',
    status: property.status as 'active' | 'pending' | 'inactive',
    available_at: property.available_at!,
    occupation: property.occupation!,
    images: property.images || [],
    image_url: property.image_url,
    vr: property.vr,
    rating: property.rating || 4.0,
    review_count: property.reviewCount || 0,
    latitude: property.location?.coordinates.lat || 22.2783,
    longitude: property.location?.coordinates.lng || 114.1747,
    nearby_mtr: property.location?.nearbyMTR || [],
    guests: property.details?.guests || 1,
    bedrooms: property.details?.bedrooms || 0,
    bathrooms: property.details?.bathrooms || 0,
    property_type: property.details?.propertyType || property.type,
    room_type: property.details?.roomType as 'shared room' | 'private room',
    amenities: property.amenities || [],
    host_id: property.host?.id || 'admin-host',
    host_name: property.host?.name || 'HKFLAL Admin',
    host_avatar: property.host?.avatar,
    host_is_superhost: property.host?.isSuperhost ?? true,
    host_response_time: property.host?.responseTime || '1 hour',
    available: property.availability?.available ?? true,
    min_stay: property.availability?.minStay || 30,
    max_stay: property.availability?.maxStay || 365,
    check_in: property.policies?.checkIn || '2:00 PM',
    check_out: property.policies?.checkOut || '12:00 PM',
    cancellation: property.policies?.cancellation || 'Flexible'
  }
}

// Convert Property to Supabase update format
const propertyToSupabaseUpdate = (property: Partial<Property>): PropertyUpdate => {
  const updateData: PropertyUpdate = {}
  
  if (property.property_id) updateData.property_id = property.property_id
  if (property.type) updateData.type = property.type as '勞工舍宿' | '學生宿舍'
  if (property.title) updateData.title = property.title
  if (property.subtitle !== undefined) updateData.subtitle = property.subtitle
  if (property.description !== undefined) updateData.description = property.description
  if (property.address) updateData.address = property.address
  if (property.district) updateData.district = property.district
  if (property.price) updateData.price = property.price
  if (property.currency) updateData.currency = property.currency
  if (property.unit) updateData.unit = property.unit as '床位' | '套房'
  if (property.status) updateData.status = property.status as 'active' | 'pending' | 'inactive'
  if (property.available_at) updateData.available_at = property.available_at
  if (property.occupation) updateData.occupation = property.occupation
  if (property.images) updateData.images = property.images
  if (property.image_url !== undefined) updateData.image_url = property.image_url
  if (property.vr !== undefined) updateData.vr = property.vr
  if (property.rating) updateData.rating = property.rating
  if (property.reviewCount) updateData.review_count = property.reviewCount
  if (property.location?.coordinates.lat) updateData.latitude = property.location.coordinates.lat
  if (property.location?.coordinates.lng) updateData.longitude = property.location.coordinates.lng
  if (property.location?.nearbyMTR) updateData.nearby_mtr = property.location.nearbyMTR
  if (property.details?.guests) updateData.guests = property.details.guests
  if (property.details?.bedrooms) updateData.bedrooms = property.details.bedrooms
  if (property.details?.bathrooms) updateData.bathrooms = property.details.bathrooms
  if (property.details?.propertyType) updateData.property_type = property.details.propertyType
  if (property.details?.roomType) updateData.room_type = property.details.roomType as 'shared room' | 'private room'
  if (property.amenities) updateData.amenities = property.amenities
  if (property.host?.id) updateData.host_id = property.host.id
  if (property.host?.name) updateData.host_name = property.host.name
  if (property.host?.avatar !== undefined) updateData.host_avatar = property.host.avatar
  if (property.host?.isSuperhost !== undefined) updateData.host_is_superhost = property.host.isSuperhost
  if (property.host?.responseTime) updateData.host_response_time = property.host.responseTime
  if (property.availability?.available !== undefined) updateData.available = property.availability.available
  if (property.availability?.minStay) updateData.min_stay = property.availability.minStay
  if (property.availability?.maxStay) updateData.max_stay = property.availability.maxStay
  if (property.policies?.checkIn) updateData.check_in = property.policies.checkIn
  if (property.policies?.checkOut) updateData.check_out = property.policies.checkOut
  if (property.policies?.cancellation) updateData.cancellation = property.policies.cancellation
  
  return updateData
}

// Get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      throw new Error(`Failed to fetch properties: ${error.message}`)
    }

    return data.map(supabaseToProperty)
  } catch (error) {
    console.error('Error in getProperties:', error)
    throw new Error('Failed to fetch properties')
  }
}

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Property with ID '${id}' not found`)
        return null // Not found
      }
      console.error('Error fetching property:', {
        id,
        error: error.message || error,
        code: error.code,
        details: error.details
      })
      throw new Error(`Failed to fetch property: ${error.message || 'Unknown error'}`)
    }

    return supabaseToProperty(data)
  } catch (error) {
    console.error('Error in getPropertyById:', {
      id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    throw new Error(`Failed to fetch property with ID '${id}': ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get properties by status
export const getPropertiesByStatus = async (status: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', status)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties by status:', error)
      throw new Error(`Failed to fetch properties by status: ${error.message}`)
    }

    return data.map(supabaseToProperty)
  } catch (error) {
    console.error('Error in getPropertiesByStatus:', error)
    throw new Error('Failed to fetch properties by status')
  }
}

// Get properties by district
export const getPropertiesByDistrict = async (district: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('district', district)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties by district:', error)
      throw new Error(`Failed to fetch properties by district: ${error.message}`)
    }

    return data.map(supabaseToProperty)
  } catch (error) {
    console.error('Error in getPropertiesByDistrict:', error)
    throw new Error('Failed to fetch properties by district')
  }
}

// Create new property
export const createProperty = async (propertyData: Partial<Property>): Promise<string> => {
  try {
    const insertData = propertyToSupabaseInsert(propertyData)
    
    const { data, error } = await supabase
      .from('properties')
      .insert(insertData)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating property:', error)
      throw new Error(`Failed to create property: ${error.message}`)
    }

    return data.id
  } catch (error) {
    console.error('Error in createProperty:', error)
    throw new Error('Failed to create property')
  }
}

// Update property
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
  try {
    const updateData = propertyToSupabaseUpdate(propertyData)
    
    const { error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating property:', error)
      throw new Error(`Failed to update property: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in updateProperty:', error)
    throw new Error('Failed to update property')
  }
}

// Delete property
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    // First, get the property to access its images for cleanup
    const property = await getPropertyById(id)
    
    // Delete associated images from storage if they exist
    if (property && property.images.length > 0) {
      for (const imageUrl of property.images) {
        if (imageUrl.includes('supabase')) {
          try {
            // Extract file path from Supabase URL
            const urlParts = imageUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const filePath = `properties/${property.property_id}/${fileName}`
            
            await supabase.storage
              .from('property-images')
              .remove([filePath])
          } catch (imageError) {
            console.warn('Failed to delete image:', imageUrl, imageError)
          }
        }
      }
    }
    
    // Delete the property record
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      throw new Error(`Failed to delete property: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in deleteProperty:', error)
    throw new Error('Failed to delete property')
  }
}

// Upload image to Supabase Storage
export const uploadPropertyImage = async (
  file: File,
  propertyId: string,
  imageIndex: number
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `image_${imageIndex}_${Date.now()}.${fileExt}`
    const filePath = `properties/${propertyId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading image:', error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error in uploadPropertyImage:', error)
    throw new Error('Failed to upload image')
  }
}

// Upload multiple images
export const uploadPropertyImages = async (
  files: File[],
  propertyId: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadPropertyImage(file, propertyId, index)
    )

    const downloadURLs = await Promise.all(uploadPromises)
    return downloadURLs
  } catch (error) {
    console.error('Error uploading images:', error)
    throw new Error('Failed to upload images')
  }
}

// Delete image from Supabase Storage
export const deletePropertyImage = async (imageUrl: string): Promise<void> => {
  try {
    if (imageUrl.includes('supabase')) {
      // Extract file path from Supabase URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const propertyFolder = urlParts[urlParts.length - 2]
      const filePath = `properties/${propertyFolder}/${fileName}`

      const { error } = await supabase.storage
        .from('property-images')
        .remove([filePath])

      if (error) {
        console.error('Error deleting image:', error)
        throw new Error(`Failed to delete image: ${error.message}`)
      }
    }
  } catch (error) {
    console.error('Error in deletePropertyImage:', error)
    throw new Error('Failed to delete image')
  }
}

// Batch operations for data migration
export const createPropertiesBatch = async (properties: Partial<Property>[]): Promise<void> => {
  try {
    const insertData = properties.map(propertyToSupabaseInsert)
    
    const { error } = await supabase
      .from('properties')
      .insert(insertData)

    if (error) {
      console.error('Error creating properties batch:', error)
      throw new Error(`Failed to create properties batch: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in createPropertiesBatch:', error)
    throw new Error('Failed to create properties batch')
  }
}

// Search properties by text
export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error searching properties:', error)
      throw new Error(`Failed to search properties: ${error.message}`)
    }

    return data.map(supabaseToProperty)
  } catch (error) {
    console.error('Error in searchProperties:', error)
    throw new Error('Failed to search properties')
  }
}

// Get statistics
export const getPropertyStats = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('status, price, rating, type, district')

    if (error) {
      console.error('Error getting property stats:', error)
      throw new Error(`Failed to get property stats: ${error.message}`)
    }

    const total = data.length
    const available = data.filter(p => p.status === 'active').length
    const pending = data.filter(p => p.status === 'pending').length
    const averagePrice = total > 0 ? Math.round(data.reduce((sum, p) => sum + p.price, 0) / total) : 0
    const averageRating = total > 0 ? Number((data.reduce((sum, p) => sum + p.rating, 0) / total).toFixed(1)) : 0

    const byType = data.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byDistrict = data.reduce((acc, p) => {
      acc[p.district] = (acc[p.district] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      available,
      pending,
      averagePrice,
      averageRating,
      byType,
      byDistrict
    }
  } catch (error) {
    console.error('Error in getPropertyStats:', error)
    throw new Error('Failed to get property stats')
  }
}