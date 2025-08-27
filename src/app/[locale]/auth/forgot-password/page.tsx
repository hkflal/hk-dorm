'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function ForgotPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual password reset
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                檢查您的電子郵件
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                我們已將重設密碼的連結發送到您的電子郵件地址。
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-green-600">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <p className="text-gray-700">
                    已發送密碼重設電子郵件至 <strong>{email}</strong>
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    沒有收到電子郵件？請檢查垃圾郵件資料夾，或稍後重試。
                  </p>
                  
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    重新發送
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center text-sm text-gray-600">
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                返回登入頁面
              </Link>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              重設密碼
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              輸入您的電子郵件地址，我們將發送密碼重設連結給您。
            </p>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    電子郵件地址
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="輸入您的電子郵件"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !email}
                  className="w-full"
                >
                  {isLoading ? '發送中...' : '發送重設連結'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-600">
            <p>
              記起密碼了？{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                返回登入
              </Link>
            </p>
          </div>
        </div>
    </div>
  )
}