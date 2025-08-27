'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Upload, RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { Property } from '@/lib/types'
import { 
  getProperties, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getPropertyStats 
} from '@/lib/supabase-services'

export default function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
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
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const ADMIN_PASSWORD = 'hkdorm123'

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError('')
      loadProperties()
      loadStats()
    } else {
      setPasswordError('密碼錯誤，請重試')
      setPasswordInput('')
    }
  }

  // Only load data after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadProperties()
      loadStats()
    }
  }, [isAuthenticated])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const propertiesData = await getProperties()
      setProperties(propertiesData)
    } catch (err) {
      console.error('Failed to load properties:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getPropertyStats()
      setStats(statsData)
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
      await deleteProperty(id)
      await loadProperties() // Reload the list
      await loadStats() // Update stats
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
        await updateProperty(editingProperty.id, propertyData)
      } else {
        // Create new property
        await createProperty(propertyData)
      }
      
      // Close form and reload data
      setIsFormOpen(false)
      setEditingProperty(null)
      await loadProperties()
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

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">管理員登入</h2>
            <p className="mt-2 text-sm text-gray-600">請輸入管理密碼</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="請輸入管理密碼"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm text-center">{passwordError}</div>
            )}
            <div>
              <Button
                type="submit"
                variant="primary"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                登入
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">房源管理</h1>
          <p className="text-gray-600 mt-2">管理您的住宿清單</p>
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
                  {(property.images && property.images.length > 0) || property.image_url ? (
                    <img
                      src={property.image_url || property.images[0]}
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