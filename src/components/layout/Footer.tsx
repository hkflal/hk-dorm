'use client'

import React from 'react'
import Link from 'next/link'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const localizedPath = (path = '') => `/${locale}${path}`

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">公司</h3>
            <ul className="space-y-2">
              <li>
                <Link href={localizedPath('/about')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href={localizedPath()} className="text-gray-600 hover:text-blue-600 transition-colors">
                  瀏覽宿舍
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">聯絡方式</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://wa.me/85244130760" className="text-gray-600 hover:text-blue-600 transition-colors">
                  WhatsApp 查詢
                </a>
              </li>
              <li>
                <a href="tel:+85244130760" className="text-gray-600 hover:text-blue-600 transition-colors">
                  +852 4413 0760
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">資源</h3>
            <ul className="space-y-2">
              <li>
                <a href="/sitemap.xml" className="text-gray-600 hover:text-blue-600 transition-colors">
                  網站地圖
                </a>
              </li>
              <li>
                <Link href={localizedPath('/about')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  平台介紹
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">信任與安全</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
              香港月租勞工宿舍平台
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">外勞宿舍</div>
                <div className="text-sm text-gray-500">Dorm Hub</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 外勞宿舍 Labour Dorm Hub. 版權所有。
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href={localizedPath('/about')} className="text-sm text-gray-500 hover:text-blue-600">
                關於我們
              </Link>
              <a href="/robots.txt" className="text-sm text-gray-500 hover:text-blue-600">
                Robots
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
