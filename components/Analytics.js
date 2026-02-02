import Script from 'next/script'

/**
 * Google Analytics Integration
 * ✅ SECURITY: Uses Next.js Script component (safe)
 * ⚠️ Environment variable must be validated at build time
 */
export default function Analytics() {
  const isProd = process.env.NODE_ENV === 'production'
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  
  // Don't load analytics in development or if GA ID is missing
  if (!isProd || !gaId) return null
  
  // Validate GA ID format (should be G-XXXXXXXXXX or UA-XXXXXXXXX)
  const isValidGaId = /^(G|UA|AW|DC)-[A-Z0-9]+$/.test(gaId)
  if (!isValidGaId) {
    console.error('🔒 Invalid Google Analytics ID format')
    return null
  }

  return (
    <>
      {/* Load Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      
      {/* Initialize Google Analytics */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
