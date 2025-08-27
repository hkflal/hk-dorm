import React from 'react'
import { Property } from '@/lib/types'
import { PropertyCard } from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  title?: string
}

export function PropertyGrid({ properties, title }: PropertyGridProps) {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      )}
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            暫時沒有住宿資料
          </h3>
          <p className="text-gray-600">
            請稍後再試或聯絡客服了解更多住宿選項
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}