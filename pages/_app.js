import '@/styles/globals.css'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import { AuthProvider } from '@/contexts/AuthContext'

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Security: Prevent clickjacking
    if (window.self !== window.top) {
      window.top.location = window.self.location
    }
    
    // Check if loading screen has already been shown in this session
    const hasShownLoading = sessionStorage.getItem('hasShownLoading')
    
    if (!hasShownLoading) {
      // Show loading screen only on first visit
      setLoading(true)
      
      const timer = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('hasShownLoading', 'true')
      }, 4500) // 4s loading + 0.5s fade out

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AuthProvider>
      <div style={{ width: '100%', overflowX: 'hidden', position: 'relative' }}>
        {loading && <LoadingScreen />}
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
}
