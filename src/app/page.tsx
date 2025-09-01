export const metadata = {
  title: 'HKFLAL - Hong Kong Labor Dormitory',
  description: 'Redirecting to Traditional Chinese version'
}

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{
        __html: `window.location.replace('/zh-hk/');`
      }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/zh-hk/" />
      </noscript>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Redirecting...
          </h1>
          <p style={{ 
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            正在重定向到繁體中文版本
          </p>
          <a 
            href="/zh-hk/" 
            style={{ 
              color: '#2563eb', 
              textDecoration: 'underline',
              fontSize: '1rem'
            }}
          >
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </>
  )
}