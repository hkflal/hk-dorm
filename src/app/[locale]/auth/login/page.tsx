'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter()
  const { signIn, sendPasswordReset, user, isAdmin, loading } = useAuth()
  const [locale, setLocale] = useState('zh-hk')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => { params.then(({ locale: nextLocale }) => setLocale(nextLocale)) }, [params])
  useEffect(() => { if (!loading && user && isAdmin) router.replace(`/${locale}/admin/`) }, [loading, user, isAdmin, router, locale])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (cause) {
      const code = cause instanceof FirebaseError ? cause.code : ''
      const message = code === 'auth/wrong-password' || code === 'auth/invalid-credential'
        ? '電郵或密碼不正確。'
        : code === 'auth/invalid-api-key'
          ? 'localhost 尚未連接 Firebase Auth Emulator。'
          : code === 'auth/network-request-failed'
            ? '無法連接 Firebase Auth Emulator，請確認本地服務已啟動。'
            : code === 'auth/email-already-in-use'
              ? '本地管理員帳戶已存在，但密碼不正確。'
              : '無法登入，請檢查本地 Authentication 設定。'
      setError(message)
    } finally { setSubmitting(false) }
  }

  const resetPassword = async () => {
    setError(''); setNotice('')
    if (!email) { setError('請先填寫電郵地址，才可發送密碼重設連結。'); return }
    setSubmitting(true)
    try {
      await sendPasswordReset(email)
      setNotice('如帳戶已啟用，密碼重設連結已發送到該電郵地址。')
    } catch {
      setError('未能發送密碼重設連結。請檢查 Firebase Authentication 的電郵範本及設定。')
    } finally { setSubmitting(false) }
  }

  return <main className="grid min-h-[calc(100dvh-8rem)] place-items-center bg-slate-50 px-4 py-10">
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <Link href={`/${locale}/`} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />返回公開網站</Link>
      <div className="mt-6"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white"><LockKeyhole className="h-6 w-6" /></div><h1 className="mt-5 text-2xl font-bold text-slate-950">管理員登入</h1><p className="mt-2 text-sm leading-6 text-slate-600">使用 Firebase Authentication 帳戶登入後台。</p></div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {!loading && user && !isAdmin && <p role="alert" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">此帳戶沒有管理權限。請以獲授權帳戶登入。</p>}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Input id="email" label="電郵" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input id="password" label="密碼" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <Button type="submit" variant="secondary" className="w-full" disabled={submitting}>{submitting ? '登入中…' : <><Mail className="mr-2 h-4 w-4" />登入管理後台</>}</Button>
      </form>
      <button type="button" onClick={resetPassword} disabled={submitting} className="mt-4 min-h-11 text-sm font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 disabled:opacity-50">忘記密碼？發送重設連結</button>
    </section>
  </main>
}
