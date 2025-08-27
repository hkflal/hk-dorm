'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

// Define partner data with meaningful names for the logos
const trustedPartners = [
  {
    id: '1',
    name: '合作夥伴 1',
    logo: '/images/partners/logo1.jpg'
  },
  {
    id: '2', 
    name: '合作夥伴 2',
    logo: '/images/partners/logo2.jpg'
  },
  {
    id: '3',
    name: '合作夥伴 3', 
    logo: '/images/partners/logo3.png'
  },
  {
    id: '4',
    name: '合作夥伴 4',
    logo: '/images/partners/logo4.png'
  },
  {
    id: '5',
    name: '合作夥伴 5',
    logo: '/images/partners/logo5.png'
  },
  {
    id: '6',
    name: '合作夥伴 6', 
    logo: '/images/partners/logo6.jpg'
  }
]

function SimpleCarousel({ children, itemsPerView = 4 }: { children: React.ReactNode[], itemsPerView?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalItems = children.length
  const maxIndex = Math.max(0, totalItems - itemsPerView)

  useEffect(() => {
    if (totalItems <= itemsPerView) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [maxIndex, totalItems, itemsPerView])

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          width: `${(totalItems / itemsPerView) * 100}%`
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${100 / totalItems}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrustedPartners() {
  const partnerSlides = trustedPartners.map((partner) => (
    <div key={partner.id} className="flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 w-full max-w-xs mx-auto group">
        <div className="relative w-full h-20 flex items-center justify-center overflow-hidden">
          <Image
            src={partner.logo || '/images/placeholder-dorm.jpg'}
            alt={partner.name}
            fill
            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">${partner.name}</div>`
              }
            }}
          />
        </div>
      </div>
    </div>
  ))

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🤝 企業合作夥伴
          </div>
          <TextGenerateEffect 
            words="為本港合作客戶提供員工宿舍" 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            duration={0.4}
            filter={true}
          />
          <TextGenerateEffect 
            words="我們與香港多家知名企業建立合作關係，為其員工提供優質、舒適的住宿解決方案。專業的管理團隊確保每位員工都能享受到賓至如歸的居住體驗。" 
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed"
            duration={0.3}
            filter={false}
          />
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 mb-8">
            <div className="text-center">
              <TextGenerateEffect 
                words="50+" 
                className="text-2xl md:text-3xl font-bold text-blue-600 mb-2"
                duration={0.5}
                filter={true}
              />
              <div className="text-sm text-gray-600">合作企業</div>
            </div>
            <div className="text-center">
              <TextGenerateEffect 
                words="500+" 
                className="text-2xl md:text-3xl font-bold text-green-600 mb-2"
                duration={0.5}
                filter={true}
              />
              <div className="text-sm text-gray-600">員工入住</div>
            </div>
            <div className="text-center">
              <TextGenerateEffect 
                words="98%" 
                className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2"
                duration={0.5}
                filter={true}
              />
              <div className="text-sm text-gray-600">客戶滿意度</div>
            </div>
            <div className="text-center">
              <TextGenerateEffect 
                words="24/7" 
                className="text-2xl md:text-3xl font-bold text-purple-600 mb-2"
                duration={0.5}
                filter={true}
              />
              <div className="text-sm text-gray-600">服務支援</div>
            </div>
          </div>
        </div>

        {/* Desktop carousel - shows 4 items */}
        <div className="hidden md:block">
          <SimpleCarousel itemsPerView={4}>
            {partnerSlides}
          </SimpleCarousel>
        </div>

        {/* Tablet carousel - shows 3 items */}
        <div className="hidden sm:block md:hidden">
          <SimpleCarousel itemsPerView={3}>
            {partnerSlides}
          </SimpleCarousel>
        </div>

        {/* Mobile carousel - shows 2 items */}
        <div className="block sm:hidden">
          <SimpleCarousel itemsPerView={2}>
            {partnerSlides}
          </SimpleCarousel>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-xl p-8 max-w-4xl mx-auto">
            <TextGenerateEffect 
              words="企業合作諮詢" 
              className="text-2xl font-semibold text-gray-900 mb-4"
              duration={0.4}
              filter={true}
            />
            <TextGenerateEffect 
              words="如果您的企業需要為員工提供住宿服務，歡迎聯絡我們的企業服務團隊。我們提供客製化的住宿解決方案，滿足不同規模企業的需求。" 
              className="text-gray-600 mb-6 leading-relaxed"
              duration={0.3}
              filter={false}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+852-4413-0760"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                📞 企業熱線: +852 4413 0760
              </a>
              <a
                href="mailto:hk_labour_dorm@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                📧 hk_labour_dorm@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}