'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface GoogleMapProps {
  address: string
  title: string
  coordinates?: {
    lat: number
    lng: number
  }
  nearbyMTR?: string[]
}

export function GoogleMap({ address, title, coordinates, nearbyMTR = [] }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          setIsLoaded(true)
          return
        }

        // Create script element
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true

        script.onload = () => {
          setIsLoaded(true)
        }

        script.onerror = () => {
          setError('Failed to load Google Maps')
        }

        document.head.appendChild(script)
      } catch (err) {
        setError('Error loading Google Maps')
        console.error('Error loading Google Maps:', err)
      }
    }

    loadGoogleMaps()
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    const initMap = async () => {
      try {
        let mapCenter = coordinates

        // If no coordinates provided, geocode the address
        if (!mapCenter) {
          const geocoder = new google.maps.Geocoder()
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results) {
                resolve(results)
              } else {
                reject(new Error(`Geocoding failed: ${status}`))
              }
            })
          })

          if (result[0]) {
            mapCenter = {
              lat: result[0].geometry.location.lat(),
              lng: result[0].geometry.location.lng()
            }
          }
        }

        if (!mapCenter) {
          setError('Could not find location')
          return
        }

        // Create map
        const googleMap = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'transit.station',
              stylers: [{ visibility: 'on' }]
            }
          ]
        })

        // Add main property marker
        const marker = new google.maps.Marker({
          position: mapCenter,
          map: googleMap,
          title: title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C10.477 2 6 6.477 6 12C6 20 16 30 16 30C16 30 26 20 26 12C26 6.477 21.523 2 16 2Z" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="16" cy="12" r="4" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }
        })

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${title}</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${address}</p>
              <div style="margin-top: 8px;">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" 
                   target="_blank" 
                   style="color: #2563eb; text-decoration: none; font-size: 14px;">
                  在 Google Maps 中查看 →
                </a>
              </div>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(googleMap, marker)
        })

        // Add MTR station markers if provided
        if (nearbyMTR.length > 0) {
          const placesService = new google.maps.places.PlacesService(googleMap)
          
          nearbyMTR.forEach((station) => {
            const request = {
              query: `${station} MTR Station Hong Kong`,
              fields: ['name', 'geometry', 'place_id'],
            }

            placesService.textSearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                const place = results[0]
                if (place.geometry && place.geometry.location) {
                  const mtrMarker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: googleMap,
                    title: `${station} MTR Station`,
                    icon: {
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="#0066CC" stroke="#FFFFFF" stroke-width="2"/>
                          <text x="12" y="16" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">M</text>
                        </svg>
                      `),
                      scaledSize: new google.maps.Size(24, 24),
                      anchor: new google.maps.Point(12, 24)
                    }
                  })

                  const mtrInfoWindow = new google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">${station} MTR Station</h4>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">港鐵站</p>
                      </div>
                    `
                  })

                  mtrMarker.addListener('click', () => {
                    mtrInfoWindow.open(googleMap, mtrMarker)
                  })
                }
              }
            })
          })
        }

        setMap(googleMap)
      } catch (err) {
        setError('Failed to initialize map')
        console.error('Map initialization error:', err)
      }
    }

    initMap()
  }, [isLoaded, address, title, coordinates, nearbyMTR])

  const handleGetDirections = () => {
    const destination = encodeURIComponent(address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(url, '_blank')
  }

  const handleViewInGoogleMaps = () => {
    const query = encodeURIComponent(address)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, '_blank')
  }

  if (error) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">地圖載入失敗</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={handleViewInGoogleMaps}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>在 Google Maps 中查看</span>
          </Button>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">載入地圖中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md"
        style={{ minHeight: '256px' }}
      />
      
      {/* Map Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetDirections}
          className="flex items-center space-x-2"
        >
          <Navigation className="w-4 h-4" />
          <span>取得路線</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewInGoogleMaps}
          className="flex items-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>在 Google Maps 中查看</span>
        </Button>
      </div>

      {/* Address Info */}
      <div className="text-sm text-gray-600">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  )
}
