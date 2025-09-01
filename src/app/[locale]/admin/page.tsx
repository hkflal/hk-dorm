'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Upload, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { Property } from '@/lib/types'

export default function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    averagePrice: 0,
    averageRating: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAuthenticated')
    const email = localStorage.getItem('userEmail')
    
    if (authStatus === 'true' && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
      loadProperties()
      loadStats()
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }, [router])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      // Mock data for now - replace with actual data loading
      const mockProperties: Property[] = [
        {
          id: '1',
          property_id: 'dorm-001',
          type: '勞工舍宿',
          title: '西洋菜南街',
          subtitle: '在旺角的勞工舍宿',
          description: 'Modern worker dormitory in the heart of Mong Kok',
          address: '旺角西洋菜南街166號',
          district: 'Mong Kok',
          price: 3500,
          currency: 'HKD',
          unit: '床位',
          status: 'active',
          available_at: 'now',
          occupation: '85%',
          images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'],
          rating: 4.2,
          reviewCount: 15,
          location: {
            district: 'Mong Kok',
            address: '旺角西洋菜南街166號',
            nearbyMTR: ['Mong Kok', 'Prince Edward'],
            coordinates: { lat: 22.3193, lng: 114.1694 }
          },
          details: {
            guests: 1,
            bedrooms: 0,
            bathrooms: 1,
            propertyType: '勞工舍宿',
            roomType: 'shared room'
          },
          amenities: ['wifi', 'aircon', 'nearMTR', 'laundry'],
          host: {
            id: 'host-1',
            name: 'HKFLAL Admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            isSuperhost: true,
            responseTime: '1 hour'
          },
          availability: {
            available: true,
            minStay: 30,
            maxStay: 365
          },
          policies: {
            checkIn: '2:00 PM',
            checkOut: '12:00 PM',
            cancellation: 'Flexible'
          }
        }
      ]
      setProperties(mockProperties)
    } catch (err) {
      console.error('Failed to load properties:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      setStats({
        total: 5,
        available: 3,
        pending: 1,
        averagePrice: 3200,
        averageRating: 4.2
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleAddProperty = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setIsFormOpen(true)
  }

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('您確定要刪除這個房源嗎？此操作無法撤銷。')) {
      return
    }

    try {
      setError(null)
      // Remove from local state for now
      setProperties(prev => prev.filter(p => p.id !== id))
      await loadStats()
    } catch (err) {
      console.error('Failed to delete property:', err)
      setError('Failed to delete property. Please try again.')
    }
  }

  const handleSaveProperty = async (propertyData: Partial<Property>) => {
    try {
      setError(null)
      
      if (editingProperty) {
        // Update existing property
        setProperties(prev => prev.map(p => p.id === editingProperty.id ? { ...p, ...propertyData } : p))
      } else {
        // Create new property
        const newProperty: Property = {
          ...propertyData as Property,
          id: Date.now().toString(),
          rating: 4.0,
          reviewCount: 0
        }
        setProperties(prev => [...prev, newProperty])
      }
      
      setIsFormOpen(false)
      setEditingProperty(null)
      await loadStats()
      
    } catch (err) {
      console.error('Failed to save property:', err)
      setError('Failed to save property. Please try again.')
    }
  }

  const handleRefresh = () => {
    loadProperties()
    loadStats()
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">房源管理</h1>
          <p className="text-gray-600 mt-2">管理您的住宿清單</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-700">Welcome, {userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleAddProperty}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>新增房源</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">總房源數</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">現在可用</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均評分</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均價格/月</p>
                <p className="text-2xl font-bold text-purple-600">HK${stats.averagePrice}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">所有房源</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">載入中...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暫無房源資料</p>
            <p className="text-sm mt-1">點擊「新增房源」開始添加</p>
          </div>
        ) : (
          properties.map((property) => (
          <Card key={property.id} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=150&h=150&fit=crop&crop=center'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.subtitle}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant={property.status === 'active' ? 'success' : property.status === 'pending' ? 'default' : 'error'}>
                        {property.status === 'active' ? '可用' : property.status === 'pending' ? '等待中' : '不可用'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {property.district}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        HK${property.price}/{property.unit}
                      </span>
                      <span className="text-xs text-gray-400">
                        {property.occupation} 入住
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProperty(property.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Property Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProperty(null)
        }}
        title={editingProperty ? '編輯房源' : '新增房源'}
      >
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingProperty(null)
          }}
        />
      </Modal>
    </div>
  )
}