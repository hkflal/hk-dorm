'use client'

import { PropertyGrid } from '@/components/property/PropertyGrid'
import { TrustedPartners } from '@/components/layout/TrustedPartners'
import { PropertyFeaturesCarousel } from '@/components/property/PropertyFeaturesCarousel'
import { HeroTitle } from '@/components/layout/HeroTitle'
import { getProperties } from '@/lib/data'
import { useEffect, useState } from 'react'
import { Property } from '@/lib/types'

interface HomePageClientProps {
  locale?: string
}

export default function HomePageClient({ locale = 'zh-hk' }: HomePageClientProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperties() {
      try {
        const allProperties = await getProperties()
        // Filter to only show properties with images
        const filteredProperties = allProperties.filter(property => 
          property.images && property.images.length > 0
        )
        setProperties(filteredProperties)
      } catch (error) {
        console.error('Failed to load properties:', error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    
    loadProperties()
  }, [])
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-dorm.jpg')"
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="space-y-8">
              <HeroTitle />
              
              {/* Call to Action Button */}
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => {
                    const message = encodeURIComponent('你好！我想了解更多關於宿舍的資訊。')
                    window.open(`https://wa.me/85244130760?text=${message}`, '_blank')
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382z"/>
                  </svg>
                  在線預約
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Partners Section */}
        <TrustedPartners />

        {/* Available Properties Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PropertyGrid 
              properties={properties} 
              title={`最新住宿選擇 ${properties.length > 0 ? `(${properties.length})` : ''}`}
              showFilter={true}
            />
          </div>
        </section>

        {/* Property Features Carousel */}
        <PropertyFeaturesCarousel />
    </>
  )
}