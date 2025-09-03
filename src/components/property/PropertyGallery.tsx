'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Handle empty images array
  const hasImages = images && images.length > 0
  const displayImages = hasImages ? images : ['/images/placeholder-dorm.jpg']

  const nextImage = useCallback(() => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
      setZoom(1)
      setRotation(0)
    }
  }, [hasImages, images.length])

  const prevImage = useCallback(() => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
      setZoom(1)
      setRotation(0)
    }
  }, [hasImages, images.length])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  
  const handleDownload = async () => {
    if (!hasImages) return
    setIsLoading(true)
    try {
      const response = await fetch(displayImages[currentImageIndex])
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}-image-${currentImageIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
        case 'Escape':
          e.preventDefault()
          setIsModalOpen(false)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          handleRotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, nextImage, prevImage])

  // Reset zoom and rotation when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setZoom(1)
      setRotation(0)
    }
  }, [isModalOpen])

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

      {/* Enhanced Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
            {/* Left side - Image info */}
            <div className="flex items-center space-x-4">
              <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                <span className="text-white text-sm font-medium">
                  {currentImageIndex + 1} / {displayImages.length}
                </span>
              </div>
              <div className="hidden md:block bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                <span className="text-white/80 text-sm">
                  {title}
                </span>
              </div>
            </div>
            
            {/* Right side - Controls */}
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="hidden md:flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-white text-xs px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button
                  onClick={handleRotate}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Rotate (R)"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
            <div 
              className="relative max-w-full max-h-full transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <Image
                src={displayImages[currentImageIndex] || '/images/placeholder-dorm.jpg'}
                alt={`${title} - View ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
                priority
                quality={95}
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 rounded-full p-3 md:p-4 text-white transition-all hover:scale-105 group"
                title="Previous Image (←)"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 rounded-full p-3 md:p-4 text-white transition-all hover:scale-105 group"
                title="Next Image (→)"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Enhanced Thumbnails */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 mx-auto max-w-fit">
                <div className="flex justify-center space-x-2 overflow-x-auto scrollbar-hide">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all hover:scale-105 ${
                        index === currentImageIndex 
                          ? 'border-white shadow-lg shadow-white/25' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <Image
                        src={image || '/images/placeholder-dorm.jpg'}
                        alt={`${title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-white/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-4 left-4 hidden lg:block">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10">
              <div className="text-white/60 text-xs space-y-1">
                <div>← → Navigate</div>
                <div>+ - Zoom</div>
                <div>R Rotate</div>
                <div>Esc Close</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}