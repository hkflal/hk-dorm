'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/layout/SearchBar'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Filter,
  SlidersHorizontal
} from 'lucide-react'
import { getProperties } from '@/lib/supabase-services'
import { Property } from '@/lib/types'

export default function SearchPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    guests: '',
    propertyType: ''
  })

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties()
        setProperties(data)
        setFilteredProperties(data)
      } catch (error) {
        console.error('Failed to load properties:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProperties()
  }, [])

  useEffect(() => {
    let filtered = properties

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.location.nearbyMTR.some(station => 
          station.toLowerCase().includes(filters.location.toLowerCase())
        )
      )
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice))
    }

    // Filter by guests
    if (filters.guests) {
      filtered = filtered.filter(property => property.details.guests >= parseInt(filters.guests))
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.subtitle.toLowerCase().includes(filters.propertyType.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }, [filters, properties])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      guests: '',
      propertyType: ''
    })
  }

  const popularLocations = ['中環', '銅鑼灣', '尖沙咀', '旺角', '觀塘', '荃灣']
  const priceRanges = [
    { label: '$500以下', min: '', max: '500' },
    { label: '$500-800', min: '500', max: '800' },
    { label: '$800-1200', min: '800', max: '1200' },
    { label: '$1200以上', min: '1200', max: '' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              搜尋理想住宿
            </h1>
            <p className="text-xl text-blue-100">
              在香港尋找完美的勞工宿舍和學生住宿
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? '隱藏篩選器' : '顯示篩選器'}
                </Button>
              </div>

              <Card className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">篩選搜尋</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-blue-600"
                    >
                      清除全部
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        地區
                      </label>
                      <input
                        type="text"
                        placeholder="輸入地區或港鐵站"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-2 flex flex-wrap gap-1">
                        {popularLocations.map(location => (
                          <Badge
                            key={location}
                            variant={filters.location === location ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleFilterChange('location', filters.location === location ? '' : location)}
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        價格範圍 (每晚)
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="最低價"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="最高價"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        {priceRanges.map(range => (
                          <Badge
                            key={range.label}
                            variant="secondary"
                            className="cursor-pointer block text-center"
                            onClick={() => {
                              handleFilterChange('minPrice', range.min)
                              handleFilterChange('maxPrice', range.max)
                            }}
                          >
                            {range.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        住客人數
                      </label>
                      <select
                        value={filters.guests}
                        onChange={(e) => handleFilterChange('guests', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">任何人數</option>
                        <option value="1">1人</option>
                        <option value="2">2人</option>
                        <option value="3">3人</option>
                        <option value="4">4人以上</option>
                      </select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SlidersHorizontal className="w-4 h-4 inline mr-1" />
                        房源類型
                      </label>
                      <select
                        value={filters.propertyType}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">所有類型</option>
                        <option value="獨立房間">獨立房間</option>
                        <option value="共享房間">共享房間</option>
                        <option value="整套公寓">整套公寓</option>
                        <option value="宿舍床位">宿舍床位</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                搜尋結果 ({filteredProperties.length})
              </h2>
              <div className="text-sm text-gray-600">
                共找到 {filteredProperties.length} 個住宿選項
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <PropertyGrid 
                properties={filteredProperties} 
              />
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl text-gray-300 mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  沒有找到符合條件的住宿
                </h3>
                <p className="text-gray-600 mb-4">
                  請嘗試調整篩選條件或搜尋關鍵字
                </p>
                <Button onClick={clearFilters} variant="primary">
                  清除所有篩選器
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}