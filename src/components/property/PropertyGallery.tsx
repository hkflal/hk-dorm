'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Handle empty images array
  const hasImages = images && images.length > 0
  const displayImages = hasImages ? images : ['/images/placeholder-dorm.jpg']

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-xl overflow-hidden">
        {/* Main Image */}
        <div 
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => {
            if (hasImages) {
              setCurrentImageIndex(0)
              setIsModalOpen(true)
            }
          }}
        >
          <Image
            src={displayImages[0]}
            alt={`${title} - Main view`}
            fill
            className="object-cover group-hover:brightness-75 transition-all duration-200"
          />
        </div>

        {/* Secondary Images */}
        {hasImages && images.slice(1, 5).map((image, index) => (
          <div 
            key={index} 
            className="relative cursor-pointer group"
            onClick={() => {
              setCurrentImageIndex(index + 1)
              setIsModalOpen(true)
            }}
          >
            <Image
              src={image || '/images/placeholder-dorm.jpg'}
              alt={`${title} - View ${index + 2}`}
              fill
              className="object-cover group-hover:brightness-75 transition-all duration-200"
            />
            {/* Show all photos overlay on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{images.length - 5} 張相片
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show All Photos Button */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentImageIndex(0)
            setIsModalOpen(true)
          }}
          className="text-gray-700 border-gray-300"
        >
          顯示所有相片 ({displayImages.length})
        </Button>
      </div>

      {/* Fullscreen Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <div className="fixed inset-0 bg-black z-50">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white">
              <span className="text-sm">
                {currentImageIndex + 1} / {displayImages.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={displayImages[currentImageIndex] || '/images/placeholder-dorm.jpg'}
              alt={`${title} - View ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex space-x-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image || '/images/placeholder-dorm.jpg'}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}