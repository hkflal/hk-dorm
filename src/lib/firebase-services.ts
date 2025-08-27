import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'
import { Property } from './types'

const PROPERTIES_COLLECTION = 'properties'

// Convert Firestore timestamp to ISO string
const timestampToString = (timestamp: any): string => {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString()
  }
  return new Date().toISOString()
}

// Convert Property data for Firestore
const propertyToFirestore = (property: Partial<Property>) => {
  const { id, createdAt, updatedAt, ...data } = property
  return {
    ...data,
    updatedAt: serverTimestamp()
  }
}

// Convert Firestore data to Property
const firestoreToProperty = (doc: any): Property => {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt)
  } as Property
}

// Get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION)
    const q = query(propertiesRef, orderBy('updatedAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => firestoreToProperty(doc))
  } catch (error) {
    console.error('Error fetching properties:', error)
    throw new Error('Failed to fetch properties')
  }
}

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id)
    const snapshot = await getDoc(propertyRef)
    
    if (snapshot.exists()) {
      return firestoreToProperty(snapshot)
    }
    
    return null
  } catch (error) {
    console.error('Error fetching property:', error)
    throw new Error('Failed to fetch property')
  }
}

// Get properties by status
export const getPropertiesByStatus = async (status: string): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION)
    const q = query(
      propertiesRef, 
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => firestoreToProperty(doc))
  } catch (error) {
    console.error('Error fetching properties by status:', error)
    throw new Error('Failed to fetch properties by status')
  }
}

// Get properties by district
export const getPropertiesByDistrict = async (district: string): Promise<Property[]> => {
  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION)
    const q = query(
      propertiesRef, 
      where('district', '==', district),
      orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => firestoreToProperty(doc))
  } catch (error) {
    console.error('Error fetching properties by district:', error)
    throw new Error('Failed to fetch properties by district')
  }
}

// Create new property
export const createProperty = async (propertyData: Partial<Property>): Promise<string> => {
  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION)
    const dataToStore = {
      ...propertyToFirestore(propertyData),
      createdAt: serverTimestamp()
    }
    
    const docRef = await addDoc(propertiesRef, dataToStore)
    return docRef.id
  } catch (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }
}

// Update property
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
  try {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id)
    const dataToUpdate = propertyToFirestore(propertyData)
    
    await updateDoc(propertyRef, dataToUpdate)
  } catch (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }
}

// Delete property
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    // First, get the property to access its images
    const property = await getPropertyById(id)
    
    // Delete associated images from storage
    if (property && property.images.length > 0) {
      for (const imageUrl of property.images) {
        if (imageUrl.includes('firebase')) {
          try {
            const imageRef = ref(storage, imageUrl)
            await deleteObject(imageRef)
          } catch (imageError) {
            console.warn('Failed to delete image:', imageUrl, imageError)
          }
        }
      }
    }
    
    // Delete the property document
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id)
    await deleteDoc(propertyRef)
  } catch (error) {
    console.error('Error deleting property:', error)
    throw new Error('Failed to delete property')
  }
}

// Upload image to Firebase Storage
export const uploadPropertyImage = async (
  file: File, 
  propertyId: string, 
  imageIndex: number
): Promise<string> => {
  try {
    const imageRef = ref(
      storage, 
      `properties/${propertyId}/image_${imageIndex}_${Date.now()}.${file.name.split('.').pop()}`
    )
    
    const snapshot = await uploadBytes(imageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
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

// Delete image from Firebase Storage
export const deletePropertyImage = async (imageUrl: string): Promise<void> => {
  try {
    if (imageUrl.includes('firebase')) {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

// Batch operations for data migration
export const createPropertiesBatch = async (properties: Partial<Property>[]): Promise<void> => {
  try {
    const createPromises = properties.map(property => createProperty(property))
    await Promise.all(createPromises)
  } catch (error) {
    console.error('Error creating properties batch:', error)
    throw new Error('Failed to create properties batch')
  }
}

// Search properties by text
export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  try {
    // Note: This is a basic implementation. For advanced search, consider using Algolia or similar
    const properties = await getProperties()
    
    const searchLower = searchTerm.toLowerCase()
    return properties.filter(property => 
      property.title.toLowerCase().includes(searchLower) ||
      property.district.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.type.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    console.error('Error searching properties:', error)
    throw new Error('Failed to search properties')
  }
}

// Get statistics
export const getPropertyStats = async () => {
  try {
    const properties = await getProperties()
    
    const total = properties.length
    const available = properties.filter(p => p.status === 'active').length
    const pending = properties.filter(p => p.status === 'pending').length
    const averagePrice = total > 0 ? properties.reduce((sum, p) => sum + p.price, 0) / total : 0
    const averageRating = total > 0 ? properties.reduce((sum, p) => sum + p.rating, 0) / total : 0
    
    const byType = properties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byDistrict = properties.reduce((acc, p) => {
      acc[p.district] = (acc[p.district] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total,
      available,
      pending,
      averagePrice: Math.round(averagePrice),
      averageRating: Number(averageRating.toFixed(1)),
      byType,
      byDistrict
    }
  } catch (error) {
    console.error('Error getting property stats:', error)
    throw new Error('Failed to get property stats')
  }
}