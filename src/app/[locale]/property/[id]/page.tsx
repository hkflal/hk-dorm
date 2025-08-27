import { notFound } from 'next/navigation'
import Image from 'next/image'
import { 
  MapPin, 
  Star, 
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
import { Badge } from '@/components/ui/Badge'

interface PropertyPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

// Generate static params for all properties across locales
export async function generateStaticParams() {
  const properties = await getProperties()
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

  return {
    title: `${property.title} - 外勞宿舍`,
    description: property.description,
    openGraph: {
      images: [property.images[0]],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { locale, id } = await params
  const property = await getPropertyById(id)
  
  if (!property) {
    notFound()
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium ml-1">{property.rating}</span>
            <span className="text-gray-500 ml-1">
              ({property.reviewCount} 條評價)
            </span>
          </div>
          
          {property.host.isSuperhost && (
            <Badge variant="info">
              超讚房東
            </Badge>
          )}
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="underline">{property.location.address}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Info */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold mb-2">{property.subtitle}</h2>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{property.details.guests} 位客人</span>
              </div>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.details.bedrooms} 間睡房</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.details.bathrooms} 間浴室</span>
              </div>
            </div>
            
            {/* Host Info */}
            <div className="flex items-center space-x-3">
              <Image
                src={property.host.avatar}
                alt={property.host.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">由 {property.host.name} 接待</p>
                <p className="text-sm text-gray-600">
                  {property.host.isSuperhost && (
                    <span className="text-blue-600 font-medium">超讚房東 • </span>
                  )}
                  回覆時間: {property.host.responseTime}
                </p>
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
                      {getAmenityName(amenity)}
                    </p>
                    <p className="text-sm text-gray-600">
                      非常適合您的入住
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold mb-4">
              房源描述
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold mb-4">
              設施與服務
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {amenityIcons[amenity] || <Shield className="w-4 h-4" />}
                  </div>
                  <span>
                    {getAmenityName(amenity)}
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
                  虛擬實景
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
              <p className="text-sm text-gray-600 mt-2 flex items-center space-x-1">
                <span>💡</span>
                <span>使用滑鼠拖拽或觸摸螢幕來環顧四周，體驗360°虛擬實景</span>
              </p>
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              位置資訊
            </h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">
                地圖將會整合於此 - {property.location.address}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">附近港鐵站:</h4>
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
          <BookingWidget property={property} />
        </div>
      </div>
    </div>
  )
}

function getAmenityName(amenity: string): string {
  const amenityNames: Record<string, string> = {
    wifi: 'WiFi 無線網絡',
    kitchen: '廚房',
    parking: '停車位',
    pool: '游泳池',
    aircon: '空調',
    laundry: '洗衣設施',
    nearMTR: '鄰近港鐵',
    selfCheckin: '自助入住',
    vrTour: '虛擬實景'
  }
  
  return amenityNames[amenity] || amenity
}