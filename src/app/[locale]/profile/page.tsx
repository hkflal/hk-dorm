'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  Heart, 
  Calendar, 
  MessageSquare, 
  Star,
  Edit,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Mock user data
const mockUser = {
  id: '1',
  firstName: '志明',
  lastName: '陳',
  email: 'chiman@example.com',
  phone: '+852 9123 4567',
  avatar: '/images/hero-dorm.jpg',
  joinDate: '2024年1月',
  isVerified: true,
  location: '香港',
  bio: '我是一名在香港讀書的學生，喜歡乾淨舒適的住宿環境。'
}

const mockBookings = [
  {
    id: '1',
    property: '舒適學生宿舍',
    location: '旺角',
    checkIn: '2024-08-15',
    checkOut: '2024-08-22',
    status: 'upcoming',
    price: 1680
  },
  {
    id: '2',
    property: '現代化單人房',
    location: '中環',
    checkIn: '2024-07-10',
    checkOut: '2024-07-17',
    status: 'completed',
    price: 2100
  }
]

const mockFavorites = [
  {
    id: '1',
    title: '豪華學生公寓',
    location: '銅鑼灣',
    price: 280,
    rating: 4.8,
    image: '/images/hero-dorm.jpg'
  },
  {
    id: '2',
    title: '溫馨雙人房',
    location: '尖沙咀',
    price: 220,
    rating: 4.6,
    image: '/images/hero-dorm.jpg'
  }
]

export default function ProfilePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '個人資料', icon: User },
    { id: 'bookings', label: '我的預訂', icon: Calendar },
    { id: 'favorites', label: '收藏清單', icon: Heart },
    { id: 'reviews', label: '我的評價', icon: MessageSquare },
    { id: 'settings', label: '帳戶設定', icon: Settings }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="info">即將入住</Badge>
      case 'completed':
        return <Badge variant="success">已完成</Badge>
      case 'cancelled':
        return <Badge variant="error">已取消</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <Image
                      src={mockUser.avatar || '/images/placeholder-dorm.jpg'}
                      alt="用戶頭像"
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                    {mockUser.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {mockUser.firstName} {mockUser.lastName}
                    </h1>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {mockUser.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {mockUser.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {mockUser.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        加入於 {mockUser.joinDate}
                      </div>
                    </div>
                    
                    {mockUser.bio && (
                      <div className="mt-4">
                        <p className="text-gray-700">{mockUser.bio}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    編輯資料
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">{mockBookings.length}</h3>
                  <p className="text-gray-600">總預訂次數</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">{mockFavorites.length}</h3>
                  <p className="text-gray-600">收藏房源</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
                  <p className="text-gray-600">用戶評分</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
        
      case 'bookings':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">我的預訂</h2>
            
            {mockBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暫無預訂記錄</h3>
                  <p className="text-gray-600 mb-4">開始探索我們的精選住宿選項</p>
                  <Link href="/">
                    <Button variant="primary">瀏覽房源</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {booking.property}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{booking.location}</span>
                            <span>{booking.checkIn} - {booking.checkOut}</span>
                            <span>HK${booking.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(booking.status)}
                          <Button variant="outline" size="sm">
                            查看詳情
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
        
      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">收藏清單</h2>
            
            {mockFavorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暫無收藏房源</h3>
                  <p className="text-gray-600 mb-4">收藏您喜歡的房源以便日後查看</p>
                  <Link href="/">
                    <Button variant="primary">瀏覽房源</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockFavorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src={favorite.image}
                        alt={favorite.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{favorite.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{favorite.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{favorite.rating}</span>
                        </div>
                        <p className="text-lg font-semibold">HK${favorite.price}/晚</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
        
      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">我的評價</h2>
            
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暫無評價</h3>
                <p className="text-gray-600">完成住宿後即可撰寫評價</p>
              </CardContent>
            </Card>
          </div>
        )
        
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">帳戶設定</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">個人資料</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      編輯個人資料
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      更改密碼
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">通知設定</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>電子郵件通知</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>短訊通知</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>推廣資訊</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-red-600 mb-4">危險區域</h3>
                  <div className="space-y-4">
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      刪除帳戶
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
    </div>
  )
}