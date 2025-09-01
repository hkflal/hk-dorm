'use client'

import React, { useState, useMemo } from 'react'
import { Property } from '@/lib/types'
import { PropertyCard } from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  title?: string
  showFilter?: boolean
}

export function PropertyGrid({ properties, title, showFilter = false }: PropertyGridProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  // Get unique regions from properties
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(properties.map(p => p.district)))
    return uniqueRegions.sort()
  }, [properties])

  // Filter properties by selected region
  const filteredProperties = useMemo(() => {
    if (selectedRegion === 'all') return properties
    return properties.filter(p => p.district === selectedRegion)
  }, [properties, selectedRegion])
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {title && (
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        )}
        
        {showFilter && regions.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="region-filter" className="text-sm font-medium text-gray-700">
              地區:
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">全部地區</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {filteredProperties.length === 0 ? (
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
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}