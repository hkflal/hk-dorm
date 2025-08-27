import { Property } from './types'
import { enhancedProperties } from './enhanced-data'

// Updated property data from CSV and image sync
export const placeholderProperties: Property[] = enhancedProperties

export const getProperties = async (): Promise<Property[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  return placeholderProperties
}

export const getPropertyById = async (id: string): Promise<Property | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  return placeholderProperties.find(p => p.id === id) || null
}