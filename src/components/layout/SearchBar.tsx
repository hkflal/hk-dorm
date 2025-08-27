'use client'

import React, { useState } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SearchBarProps {
  onSearch?: () => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = () => {
    console.log('Searching...', { location, checkIn, checkOut, guests })
    onSearch?.()
  }

  return (
    <div className="flex items-center w-full border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Location */}
      <div className="flex-1 px-4 py-3 border-r border-gray-200">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="地點 - 搜索城市或地區"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder-gray-500"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex-1 px-4 py-3 border-r border-gray-200 hidden sm:block">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none"
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex-1 px-4 py-3 border-r border-gray-200 hidden sm:block">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex-1 px-4 py-3 border-r border-gray-200 hidden md:block">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="flex-1 text-sm bg-transparent border-none outline-none"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>
                {num} 位客人
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="px-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSearch}
          className="rounded-full p-2 w-8 h-8"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}