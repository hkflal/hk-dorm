import { Property } from './types'

// Complete updated property data with all 15 properties from Excel file as source of truth
// Updated with status changes, image mappings from img0825 directory, and corrected data
export const enhancedProperties: Property[] = [
  {
    "id": "1",
    "property_id": "dorm-001",
    "type": "勞工舍宿",
    "title": "西洋菜南街",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities.",
    "address": "旺角西洋菜南街166號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "90%",
    "images": [],
    "vr": "<iframe width=\"853\" height=\"480\" src=\"https://my.matterportvr.cn/show/?m=78zzyKraxXS\" frameborder=\"0\" allowfullscreen allow=\"autoplay; fullscreen; web-share; xr-spatial-tracking;\"></iframe>",
    "rating": 4.7,
    "reviewCount": 95,
    "location": {
      "district": "旺角",
      "address": "旺角西洋菜南街166號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-1",
      "name": "Jenny Lau",
      "avatar": "https://images.unsplash.com/photo-1500000001000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "30 minutes"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-04-22T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "2",
    "property_id": "dorm-002",
    "type": "勞工舍宿",
    "title": "通菜街",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities.",
    "address": "旺角通菜街72-82號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "95%",
    "images": [],
    "vr": "<iframe width=\"853\" height=\"480\" src=\"https://my.matterportvr.cn/show/?m=5CXsRkdiTas\" frameborder=\"0\" allowfullscreen allow=\"autoplay; fullscreen; web-share; xr-spatial-tracking;\"></iframe>",
    "rating": 4.82,
    "reviewCount": 72,
    "location": {
      "district": "旺角",
      "address": "旺角通菜街72-82號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-2",
      "name": "Amy Ho",
      "avatar": "https://images.unsplash.com/photo-1500000002000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-03-12T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "3",
    "property_id": "dorm-003",
    "type": "勞工舍宿",
    "title": "有利大廈",
    "description": "勞工舍宿 located in 佐敦. Comfortable accommodation with modern amenities.",
    "address": "彌敦道186號 有利大廈",
    "district": "佐敦",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "85%",
    "images": [],
    "rating": 4.72,
    "reviewCount": 98,
    "location": {
      "district": "佐敦",
      "address": "彌敦道186號 有利大廈",
      "nearbyMTR": [
        "Jordan",
        "Yau Ma Tei",
        "Austin"
      ],
      "coordinates": {
        "lat": 22.305,
        "lng": 114.1722
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-3",
      "name": "Sarah Cheung",
      "avatar": "https://images.unsplash.com/photo-1500000003000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-02-06T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "4",
    "property_id": "student-001",
    "type": "學生宿舍",
    "title": "永利大廈",
    "description": "學生宿舍 located in 尖沙咀. Comfortable accommodation with modern amenities.",
    "address": "九龍尖沙咀金巴利道 永利大廈",
    "district": "尖沙咀",
    "price": 2800,
    "currency": "HKD",
    "unit": "套房",
    "status": "active",
    "available_at": "now",
    "occupation": "30%",
    "images": [],
    "rating": 4.63,
    "reviewCount": 72,
    "location": {
      "district": "尖沙咀",
      "address": "九龍尖沙咀金巴利道 永利大廈",
      "nearbyMTR": [
        "Tsim Sha Tsui",
        "East Tsim Sha Tsui"
      ],
      "coordinates": {
        "lat": 22.2987,
        "lng": 114.1719
      }
    },
    "details": {
      "guests": 1,
      "bedrooms": 1,
      "bathrooms": 1,
      "propertyType": "Private Suite",
      "roomType": "private room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-4",
      "name": "Lisa Ng",
      "avatar": "https://images.unsplash.com/photo-1500000004000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": true,
      "minStay": 7,
      "maxStay": 365
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-01-20T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "5",
    "property_id": "dorm-004",
    "type": "勞工舍宿",
    "title": "渣菲大廈",
    "description": "勞工舍宿 located in 銅鑼灣. Comfortable accommodation with modern amenities.",
    "address": "港島銅鑼灣謝斐道518-520號",
    "district": "銅鑼灣",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "65%",
    "images": [
      "/images/img0825/dorm-004/IMG_7705.jpg",
      "/images/img0825/dorm-004/IMG_7706.jpg",
      "/images/img0825/dorm-004/IMG_7708.jpg",
      "/images/img0825/dorm-004/IMG_7709.jpg",
      "/images/img0825/dorm-004/IMG_7710.jpg"
    ],
    "rating": 4.53,
    "reviewCount": 42,
    "location": {
      "district": "銅鑼灣",
      "address": "港島銅鑼灣謝斐道518-520號",
      "nearbyMTR": [
        "Causeway Bay",
        "Tin Hau"
      ],
      "coordinates": {
        "lat": 22.2798,
        "lng": 114.1859
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-5",
      "name": "Jenny Wong",
      "avatar": "https://images.unsplash.com/photo-1500000005000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-07-14T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "6",
    "property_id": "dorm-005",
    "type": "勞工舍宿",
    "title": "榮華大樓",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities.",
    "address": "旺角西洋菜南街14-24號榮華大樓",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "100%",
    "images": [],
    "vr": "<iframe width=\"853\" height=\"480\" src=\"https://my.matterportvr.cn/show/?m=EFTvN3XExpz\" frameborder=\"0\" allowfullscreen allow=\"autoplay; fullscreen; web-share; xr-spatial-tracking;\"></iframe>",
    "rating": 4.95,
    "reviewCount": 92,
    "location": {
      "district": "旺角",
      "address": "旺角西洋菜南街14-24號榮華大樓",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-6",
      "name": "Michael Ho",
      "avatar": "https://images.unsplash.com/photo-1500000006000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": false,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-06-19T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "7",
    "property_id": "dorm-006",
    "type": "勞工舍宿",
    "title": "青山道",
    "description": "勞工舍宿 located in 長沙灣. Comfortable accommodation with modern amenities.",
    "address": "青山道148/150 號",
    "district": "長沙灣",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "inactive",
    "available_at": "2026-01-01",
    "occupation": "0%",
    "images": [],
    "rating": 4.57,
    "reviewCount": 54,
    "location": {
      "district": "長沙灣",
      "address": "青山道148/150 號",
      "nearbyMTR": [
        "Cheung Sha Wan",
        "Sham Shui Po"
      ],
      "coordinates": {
        "lat": 22.3386,
        "lng": 114.1486
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry"
    ],
    "host": {
      "id": "host-7",
      "name": "David Lau",
      "avatar": "https://images.unsplash.com/photo-1500000007000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "30 minutes"
    },
    "availability": {
      "available": false,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-03-26T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "8",
    "property_id": "dorm-007",
    "type": "勞工舍宿",
    "title": "金輪大廈",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities.",
    "address": "旺角彌敦道737-741C號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "100%",
    "images": [],
    "vr": "<iframe width=\"853\" height=\"480\" src=\"https://my.matterportvr.cn/show/?m=aufE3Zz16p1\" frameborder=\"0\" allowfullscreen allow=\"autoplay; fullscreen; web-share; xr-spatial-tracking;\"></iframe>",
    "rating": 4.52,
    "reviewCount": 48,
    "location": {
      "district": "旺角",
      "address": "旺角彌敦道737-741C號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry"
    ],
    "host": {
      "id": "host-8",
      "name": "Sarah Wong",
      "avatar": "https://images.unsplash.com/photo-1500000008000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": false,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-05-11T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "9",
    "property_id": "dorm-008",
    "type": "勞工舍宿",
    "title": "登打士街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. Property has 3 photos available.",
    "address": "旺角登打士街168號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "70%",
    "images": [
      "/images/img0825/dorm-008/cd95d97865ffe8d9b6a5b6a14d426419.jpg",
      "/images/img0825/dorm-008/d3d74baee7c482e24cba84e0cf441225.jpg",
      "/images/img0825/dorm-008/f5f6e51f5ce7baf4418fb34237d4376f.jpg"
    ],
    "rating": 4.7,
    "reviewCount": 75,
    "location": {
      "district": "旺角",
      "address": "旺角登打士街168號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-9",
      "name": "Michael Ng",
      "avatar": "https://images.unsplash.com/photo-1500000009000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-07-03T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "10",
    "property_id": "dorm-009",
    "type": "勞工舍宿",
    "title": "奶路臣街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. Property has 5 photos available.",
    "address": "旺角奶路臣街12號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "30%",
    "images": [
      "/images/img0825/dorm-009/1765c231e4d122ab9707be4ce52710d0.jpg",
      "/images/img0825/dorm-009/23c9072399b5277d2f0301a6ed8aae54.jpg",
      "/images/img0825/dorm-009/3ed3273103a6ba783bb2857b35dc64fe.jpg",
      "/images/img0825/dorm-009/3edfbbdea7a14776ae77f1ffc57c6f87.jpg",
      "/images/img0825/dorm-009/55bb5514e374e4e543ac850eaf37bdfe.jpg"
    ],
    "rating": 4.78,
    "reviewCount": 25,
    "location": {
      "district": "旺角",
      "address": "旺角奶路臣街12號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-10",
      "name": "Amy Ho",
      "avatar": "https://images.unsplash.com/photo-1500000010000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-04-07T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "11",
    "property_id": "dorm-010",
    "type": "勞工舍宿",
    "title": "豉油街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. Property has 8 photos available.",
    "address": "旺角豉油街85-89號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "70%",
    "images": [
      "/images/img0825/dorm-010/0706445750df53aee02093306dc58692.jpg",
      "/images/img0825/dorm-010/0edd9e66ac9dd7fd805efe1e4d1a1573.jpg",
      "/images/img0825/dorm-010/1232e12dfcb9e6f1a4fad1d672f346ce.jpg",
      "/images/img0825/dorm-010/1f9aefa4337bafba935a148d72ac6e9c.jpg",
      "/images/img0825/dorm-010/4dd9914e3a416eb760be79e501cda4ab.jpg",
      "/images/img0825/dorm-010/WechatIMG1287.jpg",
      "/images/img0825/dorm-010/dfa69bd771690937c39fbfcc2ca46187.jpg",
      "/images/img0825/dorm-010/fa3282e5226186d9afa41ea5813bf6e0.jpg"
    ],
    "rating": 4.76,
    "reviewCount": 88,
    "location": {
      "district": "旺角",
      "address": "旺角豉油街85-89號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-11",
      "name": "David Ng",
      "avatar": "https://images.unsplash.com/photo-1500000011000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-05-27T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "12",
    "property_id": "dorm-011",
    "type": "勞工舍宿",
    "title": "洗衣街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. Property has 1 photo available.",
    "address": "旺角洗衣街46號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "59%",
    "images": [
      "/images/img0825/dorm-011/1b915810c33b5906f085d6e67e8dc2a3.jpg"
    ],
    "rating": 4.5,
    "reviewCount": 63,
    "location": {
      "district": "旺角",
      "address": "旺角洗衣街46號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-12",
      "name": "Lisa Ng",
      "avatar": "https://images.unsplash.com/photo-1500000012000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-01-14T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "13",
    "property_id": "dorm-012",
    "type": "勞工舍宿",
    "title": "花園街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities.",
    "address": "旺角花園街126-128號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "inactive",
    "available_at": "2026-01-01",
    "occupation": "0%",
    "images": [
      "/images/img0825/dorm-012/IMG_7456.jpg",
      "/images/img0825/dorm-012/IMG_7457.jpg",
      "/images/img0825/dorm-012/IMG_7458.jpg"
    ],
    "rating": 4.2,
    "reviewCount": 15,
    "location": {
      "district": "旺角",
      "address": "旺角花園街126-128號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-13",
      "name": "Kevin Wong",
      "avatar": "https://images.unsplash.com/photo-1500000013000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "3 hours"
    },
    "availability": {
      "available": false,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-02-15T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "14",
    "property_id": "dorm-013",
    "type": "勞工舍宿",
    "title": "亞皆老街宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. No photos currently available.",
    "address": "亞皆老街58號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "inactive",
    "available_at": "2026-02-01",
    "occupation": "0%",
    "images": [
      "/images/img0825/dorm-013/6cddba666b74059038873a54b900a1c9.jpg",
      "/images/img0825/dorm-013/c3248b440842a0273d7b8ef790b1250a.jpg",
      "/images/img0825/dorm-013/e9755643ddd0dd5f6174958b5ac55079.jpg"
    ],
    "rating": 4.1,
    "reviewCount": 8,
    "location": {
      "district": "旺角",
      "address": "亞皆老街58號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-14",
      "name": "Jessica Chan",
      "avatar": "https://images.unsplash.com/photo-1500000014000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": false,
      "responseTime": "2 hours"
    },
    "availability": {
      "available": false,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-03-08T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  },
  {
    "id": "15",
    "property_id": "dorm-014",
    "type": "勞工舍宿",
    "title": "太子道宿舍",
    "description": "勞工舍宿 located in 旺角. Comfortable accommodation with modern amenities. Property has 3 photos available.",
    "address": "旺角太子道96號",
    "district": "旺角",
    "price": 2800,
    "currency": "HKD",
    "unit": "床位",
    "status": "active",
    "available_at": "now",
    "occupation": "77%",
    "images": [],
    "rating": 4.9,
    "reviewCount": 96,
    "location": {
      "district": "旺角",
      "address": "旺角太子道96號",
      "nearbyMTR": [
        "Mong Kok",
        "Prince Edward",
        "Yau Ma Tei"
      ],
      "coordinates": {
        "lat": 22.3193,
        "lng": 114.1694
      }
    },
    "details": {
      "guests": 2,
      "bedrooms": 0,
      "bathrooms": 1,
      "propertyType": "Dormitory",
      "roomType": "shared room"
    },
    "amenities": [
      "wifi",
      "kitchen",
      "aircon",
      "laundry",
      "nearMTR"
    ],
    "host": {
      "id": "host-15",
      "name": "Lisa Chan",
      "avatar": "https://images.unsplash.com/photo-1500000015000?w=150&h=150&fit=crop&crop=face",
      "isSuperhost": true,
      "responseTime": "1 hour"
    },
    "availability": {
      "available": true,
      "minStay": 1,
      "maxStay": 90
    },
    "policies": {
      "checkIn": "2:00 PM",
      "checkOut": "11:00 AM",
      "cancellation": "Flexible"
    },
    "createdAt": "2024-08-26T16:00:00.000Z",
    "updatedAt": "2025-08-25T16:30:00.000Z"
  }
]

export const getProperties = async (): Promise<Property[]> => {
  // Return complete enhanced property data with all 15 properties from Excel file
  // Includes updated status changes, image mappings, and corrected occupation data
  await new Promise(resolve => setTimeout(resolve, 100))
  return enhancedProperties
}

export const getPropertyById = async (id: string): Promise<Property | null> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return enhancedProperties.find(p => p.id === id) || null
}

export const getPropertiesByType = async (type: string): Promise<Property[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return enhancedProperties.filter(p => p.type === type)
}

export const getPropertiesByDistrict = async (district: string): Promise<Property[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return enhancedProperties.filter(p => p.district === district)
}