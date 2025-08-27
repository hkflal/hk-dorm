'use client'

import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">公司</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">
                  招聘
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-blue-600 transition-colors">
                  新聞
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">政策</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  使用條款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  私隱政策
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-blue-600 transition-colors">
                  網站地圖
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">支援</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
                  幫助中心
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-600 hover:text-blue-600 transition-colors">
                  安全中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">信任與安全</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                香港值得信賴的學生住宿平台
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
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">
                條款
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">
                私隱
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-blue-600">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}