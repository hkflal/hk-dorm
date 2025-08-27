'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Property } from '@/lib/types'

const propertySchema = z.object({
  property_id: z.string().min(1, 'Property ID is required'),
  type: z.string().min(1, 'Property type is required'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  district: z.string().min(1, 'District is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  unit: z.string().min(1, 'Unit type is required'),
  status: z.string().min(1, 'Status is required'),
  available_at: z.string().min(1, 'Available date is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  roomType: z.string().min(1, 'Room type is required'),
  guests: z.number().min(1, 'Must accommodate at least 1 guest'),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  property?: Property | null
  onSave: (data: Partial<Property>) => void
  onCancel: () => void
}

const HONG_KONG_DISTRICTS = [
  'Central', 'Admiralty', 'Wan Chai', 'Causeway Bay', 'North Point', 'Quarry Bay',
  'Tai Koo', 'Shau Kei Wan', 'Chai Wan', 'Aberdeen', 'Wong Chuk Hang', 'Stanley',
  'Repulse Bay', 'Tsim Sha Tsui', 'Yau Ma Tei', 'Mong Kok', 'Prince Edward',
  'Sham Shui Po', 'Cheung Sha Wan', 'Lai Chi Kok', 'Mei Foo', 'Kowloon Tong',
  'Wong Tai Sin', 'Diamond Hill', 'Choi Hung', 'Kowloon Bay', 'Ngau Tau Kok',
  'Kwun Tong', 'Lam Tin', 'Yau Tong', 'Lei Yue Mun'
]

const AMENITIES_LIST = [
  'wifi', 'kitchen', 'aircon', 'laundry', 'nearMTR', 'selfCheckin', 'parking', 'gym', 'pool', 'security'
]

const MTR_STATIONS = [
  'Central', 'Admiralty', 'Wan Chai', 'Causeway Bay', 'Tin Hau', 'Fortress Hill',
  'North Point', 'Quarry Bay', 'Tai Koo', 'Sai Wan Ho', 'Shau Kei Wan', 'Heng Fa Chuen',
  'Chai Wan', 'Tsim Sha Tsui', 'Jordan', 'Yau Ma Tei', 'Mong Kok', 'Prince Edward',
  'Sham Shui Po', 'Cheung Sha Wan', 'Lai Chi Kok', 'Mei Foo', 'Lai King', 'Kwai Fong',
  'Kwai Hing', 'Tai Wo Hau', 'Tsuen Wan', 'Kowloon Tong', 'Lok Fu', 'Wong Tai Sin',
  'Diamond Hill', 'Choi Hung', 'Kowloon Bay', 'Ngau Tau Kok', 'Kwun Tong', 'Lam Tin',
  'Yau Tong', 'Tiu Keng Leng'
]

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [])
  const [nearbyMTR, setNearbyMTR] = useState<string[]>(property?.location?.nearbyMTR || [])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [vrUrl, setVrUrl] = useState(property?.vr || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_id: property?.property_id || '',
      type: property?.type || '勞工舍宿',
      title: property?.title || '',
      subtitle: property?.subtitle || '',
      description: property?.description || '',
      address: property?.address || '',
      district: property?.district || '',
      price: property?.price || 0,
      unit: property?.unit || '床位',
      status: property?.status || 'active',
      available_at: property?.available_at || 'now',
      occupation: property?.occupation || '0%',
      roomType: property?.details?.roomType || 'shared room',
      guests: property?.details?.guests || 1,
      bedrooms: property?.details?.bedrooms || 0,
      bathrooms: property?.details?.bathrooms || 0,
    }
  })

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const toggleMTRStation = (station: string) => {
    setNearbyMTR(prev => 
      prev.includes(station) 
        ? prev.filter(s => s !== station)
        : [...prev, station]
    )
  }

  const onSubmit = (data: PropertyFormData) => {
    const propertyData: Partial<Property> = {
      property_id: data.property_id,
      type: data.type,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      address: data.address,
      district: data.district,
      price: data.price,
      currency: 'HKD',
      unit: data.unit,
      status: data.status,
      available_at: data.available_at,
      occupation: data.occupation,
      images: images,
      vr: vrUrl,
      rating: property?.rating || 4.0,
      reviewCount: property?.reviewCount || 0,
      location: {
        district: data.district,
        address: data.address,
        nearbyMTR: nearbyMTR,
        coordinates: property?.location?.coordinates || { lat: 22.2783, lng: 114.1747 }
      },
      details: {
        guests: data.guests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        propertyType: data.type,
        roomType: data.roomType
      },
      amenities: amenities,
      host: property?.host || {
        id: 'admin-host',
        name: 'HKFLAL Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isSuperhost: true,
        responseTime: '1 hour'
      },
      availability: {
        available: data.status === 'active',
        minStay: 30,
        maxStay: 365
      },
      policies: property?.policies || {
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Flexible'
      }
    }
    
    onSave(propertyData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-96 overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <Input
          label="Property ID"
          {...register('property_id')}
          error={errors.property_id?.message}
          placeholder="e.g., dorm-001, student-001"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            {...register('type')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="勞工舍宿">勞工舍宿</option>
            <option value="學生宿舍">學生宿舍</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        <Input
          label="Property Title"
          {...register('title')}
          error={errors.title?.message}
          placeholder="e.g., 西洋菜南街"
        />
        
        <Input
          label="Subtitle (Optional)"
          {...register('subtitle')}
          error={errors.subtitle?.message}
          placeholder="e.g., 在旺角的勞工舍宿"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Describe your property..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (HKD)"
            type="number"
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="3500"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Type
            </label>
            <select
              {...register('unit')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="床位">床位</option>
              <option value="套房">套房</option>
            </select>
            {errors.unit && (
              <p className="mt-1 text-xs text-red-600">{errors.unit.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>
          <Input
            label="Available At"
            {...register('available_at')}
            error={errors.available_at?.message}
            placeholder="now or date"
          />
          <Input
            label="Occupation"
            {...register('occupation')}
            error={errors.occupation?.message}
            placeholder="85%"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            {...register('district')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">Select District</option>
            {HONG_KONG_DISTRICTS.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>
          )}
        </div>
        
        <Input
          label="Full Address"
          {...register('address')}
          error={errors.address?.message}
          placeholder="e.g., 旺角西洋菜南街166號"
        />
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Details</h3>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              {...register('roomType')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="shared room">Shared Room</option>
              <option value="private room">Private Room</option>
            </select>
            {errors.roomType && (
              <p className="mt-1 text-xs text-red-600">{errors.roomType.message}</p>
            )}
          </div>
          <Input
            label="Guests"
            type="number"
            {...register('guests', { valueAsNumber: true })}
            error={errors.guests?.message}
            min={1}
          />
          <Input
            label="Bedrooms"
            type="number"
            {...register('bedrooms', { valueAsNumber: true })}
            error={errors.bedrooms?.message}
            min={0}
          />
          <Input
            label="Bathrooms"
            type="number"
            {...register('bathrooms', { valueAsNumber: true })}
            error={errors.bathrooms?.message}
            min={0}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Image URL (https://...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={addImage} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Amenities</h3>
        <div className="grid grid-cols-3 gap-2">
          {AMENITIES_LIST.map(amenity => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                amenities.includes(amenity)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* VR Tour */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">VR Tour (Optional)</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VR Iframe Code
          </label>
          <textarea
            value={vrUrl}
            onChange={(e) => setVrUrl(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder='<iframe src="..." width="853" height="480" frameborder="0" allowfullscreen></iframe>'
          />
        </div>
      </div>

      {/* Nearby MTR */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Nearby MTR Stations</h3>
        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {MTR_STATIONS.map(station => (
            <button
              key={station}
              type="button"
              onClick={() => toggleMTRStation(station)}
              className={`p-1 text-xs rounded border transition-colors ${
                nearbyMTR.includes(station)
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {station}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t">
        <Button type="submit" variant="primary">
          {property ? 'Update Property' : 'Add Property'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}