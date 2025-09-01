// This root layout provides the basic HTML structure
// Actual content is handled in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Don't add html/body tags here since they're in [locale]/layout.tsx
  return children
}