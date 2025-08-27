'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Heart, Star, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Property } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const t = useTranslations('property')
  const locale = useLocale()
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  // Use a default image if no images are available
  const defaultImage = '/images/placeholder-dorm.jpg'
  const displayImage = property.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : defaultImage

  return (
    <Link href={`/${locale}/property/${property.id}`}>
      <Card hover className="overflow-hidden">
        {/* Image Section */}
        <div className="relative h-64 group">
          <Image
            src={displayImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Navigation */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Superhost Badge */}
          {property.host.isSuperhost && (
            <div className="absolute top-3 left-3">
              <Badge variant="info" className="text-xs">
                {t('superhost')}
              </Badge>
            </div>
          )}

          {/* Image Dots */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Location and Rating */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{property.location.district}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{property.rating}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({property.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {property.title}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {property.subtitle}
          </p>

          {/* Property Details */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span>{property.details.guests} {t('guests')}</span>
            <span className="mx-2">•</span>
            <span>{property.details.bedrooms} {t('bedrooms')}</span>
            <span className="mx-2">•</span>
            <span>{property.details.bathrooms} {t('bathrooms')}</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="default" className="text-xs">
                {t(amenity)}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-gray-600 ml-1">
              {t('perNight')}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}