export interface Property {
  id: string
  property_id: string
  type: '勞工舍宿' | '學生宿舍' | string
  title: string
  subtitle?: string
  description?: string
  address: string
  district: string
  price: number
  currency: string
  unit: '床位' | '套房' | string
  status: 'active' | 'pending' | 'inactive'
  available_at: string
  occupation: string
  images: string[]
  image_url?: string
  vr?: string
  rating: number
  reviewCount: number
  location: {
    district: string
    address: string
    nearbyMTR: string[]
    coordinates: {
      lat: number
      lng: number
    }
  }
  details: {
    guests: number
    bedrooms: number
    bathrooms: number
    propertyType: string
    roomType: 'shared room' | 'private room' | string
  }
  amenities: string[]
  host: {
    id: string
    name: string
    avatar: string
    isSuperhost: boolean
    responseTime: string
  }
  availability: {
    available: boolean
    minStay: number
    maxStay: number
  }
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
  }
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  propertyId: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  verified: boolean
  createdAt: string
}

export interface Booking {
  id: string
  propertyId: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}