import { notFound } from 'next/navigation'
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Coffee, 
  Waves,
  Shield,
  Key,
  Camera
} from 'lucide-react'
import { getPropertyById, getProperties } from '@/lib/data'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { BookingWidget } from '@/components/property/BookingWidget'
import { GoogleMap } from '@/components/property/GoogleMap'
import { Badge } from '@/components/ui/Badge'
import { siteName, siteUrl } from '@/lib/seo'
import { isIndexableProperty, propertyDisplayAddress, propertyDisplayName } from '@/lib/property-visibility'

interface PropertyPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

// Generate static params for all properties across locales
export async function generateStaticParams() {
  const properties = (await getProperties()).filter(isIndexableProperty)
  const locales = ['en', 'zh-hk']
  
  return locales.flatMap(locale => 
    properties.map((property) => ({
      locale,
      id: property.id,
    }))
  )
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { locale, id } = await params
  const property = await getPropertyById(id)
  
  if (!property) {
    return {
      title: '找不到房源',
      description: '無法找到所請求的房源。',
    }
  }

  const isEnglish = locale === 'en'
  const path = `/${isEnglish ? 'en' : 'zh-hk'}/property/${property.id}/`
  const propertyName = propertyDisplayName(property, locale)
  const description = isEnglish
    ? `${propertyName} in ${property.location.district}, Hong Kong. Check bed availability, facilities and the monthly rate of HK$${property.price.toLocaleString('en-US')}.`
    : `香港${property.location.district}${propertyName}月租宿舍。查看床位、設施、位置及每月 HK$${property.price.toLocaleString('en-US')} 的住宿資料。`

  return {
    title: propertyName,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/property/${property.id}/`,
        'zh-HK': `/zh-hk/property/${property.id}/`,
        'x-default': `/zh-hk/property/${property.id}/`,
      },
    },
    openGraph: {
      title: propertyName,
      description,
      url: path,
      type: 'website',
      images: property.images[0] ? [property.images[0]] : [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { locale, id } = await params
  const property = await getPropertyById(id)
  
  if (!property) {
    notFound()
  }

  if (!isIndexableProperty(property)) notFound()

  const propertyPath = `/${locale}/property/${property.id}/`
  const propertyUrl = `${siteUrl}${propertyPath}`
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: propertyDisplayName(property, locale),
    description: locale === 'en' ? property.descriptionEn || property.description : property.description,
    url: propertyUrl,
    image: property.images.map((image) => new URL(image, siteUrl).toString()),
    priceRange: `HK$${property.price.toLocaleString('en-US')} / month`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location.address,
      addressLocality: property.location.district,
      addressRegion: 'Hong Kong',
      addressCountry: 'HK',
    },
    amenityFeature: property.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: getAmenityName(amenity, locale),
      value: true,
    })),
    brand: {
      '@type': 'Organization',
      name: siteName,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: siteName, item: `${siteUrl}/${locale}/` },
      { '@type': 'ListItem', position: 2, name: propertyDisplayName(property, locale), item: propertyUrl },
    ],
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-4 h-4" />,
    kitchen: <Coffee className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    pool: <Waves className="w-4 h-4" />,
    aircon: <Shield className="w-4 h-4" />,
    laundry: <Shield className="w-4 h-4" />,
    nearMTR: <MapPin className="w-4 h-4" />,
    selfCheckin: <Key className="w-4 h-4" />,
    vrTour: <Camera className="w-4 h-4" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          {propertyDisplayName(property, locale)}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="underline">{propertyDisplayAddress(property, locale)}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <PropertyGallery images={property.images} title={propertyDisplayName(property, locale)} locale={locale} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Info */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-2">{locale === 'en' ? 'Accommodation details' : '住宿資料'}</h2>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{property.availableBeds == null ? (locale === 'en' ? 'Availability on enquiry' : '空缺請查詢確認') : `${property.availableBeds} ${locale === 'en' ? 'beds available' : '個可用床位'}`}</span>
              </div>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.gender === 'male' ? (locale === 'en' ? 'Male only' : '男士') : property.gender === 'female' ? (locale === 'en' ? 'Female only' : '女士') : (locale === 'en' ? 'Any gender' : '不限性別')}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{locale === 'en' ? `Minimum ${property.minStayMonths || 1} month` : `最短 ${property.minStayMonths || 1} 個月`}</span>
              </div>
            </div>
            
          </div>

          {/* Key Features */}
          <div className="border-b border-gray-200 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.amenities.slice(0, 3).map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {amenityIcons[amenity] || <Shield className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {getAmenityName(amenity, locale)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {locale === 'en' ? 'Included at this property' : '房源提供'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'en' ? 'About this accommodation' : '房源描述'}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'en' ? property.descriptionEn || property.description : property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'en' ? 'Amenities' : '設施與服務'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {amenityIcons[amenity] || <Shield className="w-4 h-4" />}
                  </div>
                  <span>
                    {getAmenityName(amenity, locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* VR Tour */}
          {property.vr && (
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  {locale === 'en' ? 'Virtual tour' : '虛擬實景'}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  360°
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="w-full aspect-video"
                  style={{ minHeight: '400px' }}
                  dangerouslySetInnerHTML={{ __html: property.vr }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {locale === 'en' ? 'Drag with a mouse or touch screen to look around the 360° tour.' : '可使用滑鼠拖拽或觸摸螢幕環顧四周，體驗 360° 虛擬實景。'}
              </p>
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'en' ? 'Location' : '位置資訊'}
            </h3>
            <GoogleMap
              address={property.location.address}
              title={propertyDisplayName(property, locale)}
              coordinates={property.location.coordinates}
              nearbyMTR={property.location.nearbyMTR}
            />
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">{locale === 'en' ? 'Nearby MTR stations:' : '附近港鐵站：'}</h4>
              <div className="flex flex-wrap gap-2">
                {property.location.nearbyMTR.map((station) => (
                  <Badge key={station} variant="default">
                    {station}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="lg:col-span-1">
          <BookingWidget property={property} locale={locale} />
        </div>
      </div>
    </div>
  )
}

function getAmenityName(amenity: string, locale: string): string {
  const amenityNames: Record<string, [string, string]> = {
    wifi: ['WiFi 無線網絡', 'WiFi'],
    kitchen: ['廚房', 'Kitchen'],
    parking: ['停車位', 'Parking'],
    pool: ['游泳池', 'Swimming pool'],
    aircon: ['空調', 'Air conditioning'],
    laundry: ['洗衣設施', 'Laundry'],
    nearMTR: ['鄰近港鐵', 'Near MTR'],
    selfCheckin: ['自助入住', 'Self check-in'],
    vrTour: ['虛擬實景', 'Virtual tour']
  }
  
  const translated = amenityNames[amenity]
  return translated ? translated[locale === 'en' ? 1 : 0] : amenity
}
