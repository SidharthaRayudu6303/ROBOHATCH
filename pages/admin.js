import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

export default function Admin() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // OPTION B: Admin panel temporarily disabled
  // Reason: Requires full backend integration (12-16 hours)
  // Current implementation uses localStorage (not production-safe)
  // See ADMIN_DECISION_REQUIRED.md for details
  useEffect(() => {
    // Redirect to homepage
    router.replace('/')
  }, [router])

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-[120px] pb-20 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <i className="fas fa-tools text-6xl text-orange-500 mb-6"></i>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Admin Panel Temporarily Unavailable
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We're upgrading the admin panel to use our new backend infrastructure.
            </p>
            <p className="text-gray-500 mb-8">
              For product management, please contact the technical team or use database tools directly.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-primary-orange to-[#ff3b29] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <i className="fas fa-home mr-2"></i>
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
