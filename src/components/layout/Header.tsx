'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface HeaderProps {
  locale?: string
}

export function Header({ locale = 'zh-hk' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">外勞宿舍</div>
            <div className="text-lg text-gray-600 hidden sm:block">LABOUR DORM</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-blue-600 transition-colors">
              首頁
            </Link>
            <Link href={`/${locale}/admin`} className="text-gray-700 hover:text-blue-600 transition-colors">
              管理
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-700 hover:text-blue-600 transition-colors">
              關於我們
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            
            <Link href={`/${locale}/profile`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600"
              >
                <Heart className="h-5 w-5" />
                <span className="ml-2">收藏</span>
              </Button>
            </Link>

            <Link href={`/${locale}/auth/login`}>
              <Button
                variant="outline"
                size="sm"
              >
                <User className="h-5 w-5 mr-2" />
                登入
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      <Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="選單">
        <div className="space-y-4">
          <Link 
            href={`/${locale}`} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            首頁
          </Link>
          <Link 
            href={`/${locale}/admin`} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            管理
          </Link>
          <Link 
            href={`/${locale}/about`} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            關於我們
          </Link>
          
          <div className="border-t pt-4 space-y-2">
            
            <Link href={`/${locale}/profile`}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-2" />
                收藏
              </Button>
            </Link>
            
            <Link href={`/${locale}/auth/login`}>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                登入
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

    </header>
  )
}