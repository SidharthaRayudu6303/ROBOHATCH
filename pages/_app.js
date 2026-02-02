import '@/styles/globals.css'
import { useEffect, useState, Component } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Global Error Boundary - Catches all React errors
 * Prevents white screen of death in production
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary caught:', error, errorInfo)
    
    // Log error for monitoring (can integrate with external service if needed)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Production error logging here
      console.error('Production Error:', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }
    
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-6">
              <i className="fas fa-exclamation-triangle text-7xl text-red-500 mb-4"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-brown mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-50 p-4 rounded-lg mb-6">
                <summary className="cursor-pointer font-semibold text-red-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-primary-orange text-white rounded-full font-semibold shadow-lg hover:bg-hover-orange transition-all duration-300"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gray-200 text-dark-brown rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                <i className="fas fa-home mr-2"></i>
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

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
    <ErrorBoundary>
      <AuthProvider>
        <div style={{ width: '100%', overflowX: 'hidden', position: 'relative' }}>
          {loading && <LoadingScreen />}
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}
