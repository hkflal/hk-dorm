import { Property } from './types'
import { enhancedProperties } from './enhanced-data'

// Updated property data from CSV and image sync
export const placeholderProperties: Property[] = enhancedProperties

export const getProperties = async (): Promise<Property[]> => {
  return placeholderProperties
}

export const getPropertyById = async (id: string): Promise<Property | null> => {
  return placeholderProperties.find(p => p.id === id) || null
}
