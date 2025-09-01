import { redirect } from 'next/navigation'

// This page redirects to the default locale
// The middleware will handle the actual redirection
export default function RootPage() {
  redirect('/zh-hk/')
}