declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google.maps {
  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    mapTypeControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
    zoomControl?: boolean
    styles?: MapTypeStyle[]
  }

  interface MapTypeStyle {
    featureType?: string
    elementType?: string
    stylers?: Array<{
      visibility?: string
      color?: string
      weight?: number
      gamma?: number
      lightness?: number
      saturation?: number
    }>
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    map?: Map | null
    title?: string
    icon?: string | Icon | Symbol
  }

  interface Icon {
    url: string
    scaledSize?: Size
    anchor?: Point
  }

  interface InfoWindowOptions {
    content?: string | Element | Text
  }

  class Map {
    constructor(mapDiv: Element | null, opts?: MapOptions)
  }

  class Marker {
    constructor(opts?: MarkerOptions)
    addListener(eventName: string, handler: Function): void
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions)
    open(map?: Map | StreetViewPanorama, anchor?: Marker): void
  }

  class Geocoder {
    geocode(
      request: GeocoderRequest,
      callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
    ): void
  }

  interface GeocoderRequest {
    address?: string
    location?: LatLng | LatLngLiteral
    placeId?: string
  }

  interface GeocoderResult {
    geometry: {
      location: LatLng
      location_type: GeocoderLocationType
      viewport: LatLngBounds
    }
    formatted_address: string
    place_id: string
  }

  enum GeocoderStatus {
    OK = 'OK',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    ZERO_RESULTS = 'ZERO_RESULTS',
    ERROR = 'ERROR'
  }

  enum GeocoderLocationType {
    ROOFTOP = 'ROOFTOP',
    RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
    GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
    APPROXIMATE = 'APPROXIMATE'
  }

  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string)
  }

  class Point {
    constructor(x: number, y: number)
  }

  interface LatLng {
    lat(): number
    lng(): number
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface LatLngBounds {
    getNorthEast(): LatLng
    getSouthWest(): LatLng
  }

  namespace places {
    class PlacesService {
      constructor(attrContainer: Map | HTMLDivElement)
      textSearch(
        request: TextSearchRequest,
        callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
      ): void
    }

    interface TextSearchRequest {
      query: string
      fields?: string[]
    }

    interface PlaceResult {
      geometry?: PlaceGeometry
      name?: string
      place_id?: string
    }

    interface PlaceGeometry {
      location?: LatLng
      viewport?: LatLngBounds
    }

    enum PlacesServiceStatus {
      OK = 'OK',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      ZERO_RESULTS = 'ZERO_RESULTS',
      NOT_FOUND = 'NOT_FOUND'
    }
  }
}

export {}
