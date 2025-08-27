import { SearchBar } from '@/components/layout/SearchBar'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { TrustedPartners } from '@/components/layout/TrustedPartners'
import { PropertyFeaturesCarousel } from '@/components/property/PropertyFeaturesCarousel'
import { HeroTitle } from '@/components/layout/HeroTitle'
import { getProperties } from '@/lib/data'

export const metadata = {
  title: '外勞宿舍 - 香港勞工宿舍',
  description: '在香港尋找完美的宿舍。舒適、實惠且位置便利的打工人、學生和年輕專業人士住宿。',
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-hk' }
  ]
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let properties = []
  
  try {
    const allProperties = await getProperties()
    // Filter to only show properties with images
    properties = allProperties.filter(property => 
      property.images && property.images.length > 0
    )
  } catch (error) {
    console.error('Failed to load properties:', error)
    // Continue with empty array - PropertyGrid will handle empty state
  }
  
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
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <SearchBar />
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
            />
          </div>
        </section>

        {/* Property Features Carousel */}
        <PropertyFeaturesCarousel />
    </>
  )
}