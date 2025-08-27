'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Property } from '@/lib/types'

interface BookingWidgetProps {
  property: Property
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const subtotal = nights * property.price
  const serviceFee = subtotal * 0.1 // 10% service fee
  const cleaningFee = 200 // HKD
  const total = subtotal + serviceFee + cleaningFee

  return (
    <div className="sticky top-24">
      <Card className="shadow-xl border border-gray-200">
        <CardContent className="p-6">
          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900">
                HK${property.price}
              </span>
              <span className="text-gray-600 ml-1">/晚</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{property.rating}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({property.reviewCount} 條評價)
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="border border-gray-300 rounded-lg mb-4">
            <div className="grid grid-cols-2">
              <div className="p-3 border-r border-gray-300">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  入住
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm border-none outline-none bg-transparent"
                />
              </div>
              <div className="p-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  退房
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm border-none outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="border-t border-gray-300 p-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                客人
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm">{guests} 位客人</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={guests <= 1}
                  >
                    -
                  </button>
                  <button
                    onClick={() => setGuests(Math.min(property.details.guests, guests + 1))}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={guests >= property.details.guests}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve Button */}
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full mb-4"
            disabled={!checkIn || !checkOut || nights <= 0}
          >
            立即預訂
          </Button>

          <p className="text-center text-sm text-gray-600 mb-4">
            您暫時不會被收費
          </p>

          {/* Price Breakdown */}
          {nights > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="underline">
                  HK${property.price} x {nights} 晚
                </span>
                <span>HK${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="underline">服務費</span>
                <span>HK${serviceFee.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="underline">清潔費</span>
                <span>HK${cleaningFee}</span>
              </div>
              <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
                <span>總價</span>
                <span>HK${total.toFixed(0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}