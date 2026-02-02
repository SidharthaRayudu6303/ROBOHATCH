'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { getCart } from '../lib/api'

export default function Navbar({ hideLogin = false, hideMenu = false, hideCart = false }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth() // ✅ Single source of truth
  const [cartCount, setCartCount] = useState(0)
  const [updates, setUpdates] = useState([])
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Load cart count from backend on mount
    updateCartCount()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    // Load updates
    loadUpdates()
    
    // Listen for updates changes
    const handleUpdatesChange = () => {
      loadUpdates()
    }
    window.addEventListener('updatesChanged', handleUpdatesChange)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('updatesChanged', handleUpdatesChange)
    }
  }, [])

  useEffect(() => {
    // Auto-rotate updates every 5 seconds
    if (updates.length > 1) {
      const interval = setInterval(() => {
        setCurrentUpdateIndex((prev) => (prev + 1) % updates.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [updates.length])

  // ✅ BACKEND CART COUNT - No localStorage
  const updateCartCount = async () => {
    try {
      const cartData = await getCart()
      const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)
    } catch (error) {
      // User not logged in or cart empty
      setCartCount(0)
    }
  }

  const loadUpdates = () => {
    if (typeof window !== 'undefined') {
      const storedUpdates = JSON.parse(localStorage.getItem('siteUpdates') || '[]')
      const activeUpdates = storedUpdates.filter(update => update.active)
      setUpdates(activeUpdates)
    }
  }

  const handleLogout = async () => {
    await logout()
    setCartCount(0)
  }

  return (
    <>
      <nav className="sticky top-0 bg-white/98 backdrop-blur-md shadow-md z-[1000] transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <Link href="/" className="text-base sm:text-2xl md:text-3xl font-extrabold text-black tracking-wide flex items-center gap-2 sm:gap-3 no-underline transition-opacity duration-300 hover:opacity-80">
              <Image src="/logo.png" alt="ROBOHATCH Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px] md:w-[55px] md:h-[55px] rounded-full border-2 border-primary-orange p-[5px] bg-white shadow-[0_2px_10px_rgba(242,92,5,0.3)] transition-transform duration-300 hover:scale-105" />
              <span>ROBOHATCH</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {!hideMenu && (
                <>
                  {/* Desktop Menu */}
                  <ul className="hidden md:flex list-none gap-6 lg:gap-8 xl:gap-10">
                    <li><Link href="/" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Home</Link></li>
                    <li><Link href="/#services" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Categories</Link></li>
                    <li><Link href="/#products" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Products</Link></li>
                    <li><Link href="/about" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">About</Link></li>
                    <li><Link href="/contact" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Contact</Link></li>
                    {isAuthenticated && (
                      <li><Link href="/profile" className="no-underline text-dark-brown font-medium text-sm lg:text-base xl:text-lg transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Profile</Link></li>
                    )}
                  </ul>
                </>
              )}
              <div className="flex items-center gap-3 sm:gap-4">
              {!hideCart && (
                <Link href="/cart" className="relative text-dark-brown text-2xl sm:text-[1.3rem] transition-colors duration-300 no-underline hover:text-primary-orange active:scale-90 p-1">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="absolute top-[-10px] right-[-12px] bg-gradient-to-br from-primary-orange to-hover-orange text-white rounded-full w-[18px] h-[18px] sm:w-[18px] sm:h-[18px] flex items-center justify-center text-[0.65rem] sm:text-[0.7rem] font-bold shadow-md">{cartCount}</span>
                </Link>
              )}
              {!hideLogin && isAuthenticated && (
                <Link href="/profile" className="text-dark-brown text-2xl sm:text-[1.3rem] transition-colors duration-300 no-underline hover:text-primary-orange active:scale-90 p-1">
                  <i className="fas fa-user-circle"></i>
                </Link>
              )}
              {!hideLogin && !isAuthenticated && !authLoading && (
                <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-primary-orange to-hover-orange text-white no-underline rounded-full font-semibold text-sm sm:text-[0.95rem] shadow-[0_4px_15px_rgba(242,92,5,0.3)] transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-[left] before:duration-500 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] hover:before:left-full active:translate-y-0">
                  <i className="fas fa-sign-in-alt text-base sm:text-[1.1rem] animate-pulse-custom"></i>
                  <span>Login</span>
                </Link>
              )}
              {!hideLogin && isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-gray-600 to-gray-700 text-white no-underline rounded-full font-semibold text-sm sm:text-[0.95rem] shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-0"
                >
                  <i className="fas fa-sign-out-alt text-base sm:text-[1.1rem]"></i>
                  <span>Logout</span>
                </button>
              )}
              {!hideMenu && (
                <button
                  className="md:hidden text-dark-brown text-2xl p-2 hover:bg-orange-50 rounded-lg transition-all active:scale-90"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
              )}
            </div>
            </div>
          </div>
          {/* Mobile Menu Dropdown */}
          {!hideMenu && mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <ul className="flex flex-col gap-4">
                <li><Link href="/" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                <li><Link href="/#services" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Categories</Link></li>
                <li><Link href="/#products" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Products</Link></li>
                <li><Link href="/about" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
                <li><Link href="/contact" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                {isAuthenticated && (
                  <li><Link href="/profile" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-user-circle mr-2"></i>My Profile</Link></li>
                )}
                {!isAuthenticated && (
                  <li><Link href="/login" className="block no-underline text-dark-brown font-medium text-base py-2 px-4 hover:bg-orange-50 hover:text-primary-orange transition-colors" onClick={() => setMobileMenuOpen(false)}><i className="fas fa-sign-in-alt mr-2"></i>Login</Link></li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
      
      {/* Updates Banner */}
      {updates.length > 0 && (
        <div className="bg-gradient-to-r from-primary-orange via-hover-orange to-primary-orange py-2 sm:py-2.5 px-3 sm:px-5 shadow-md overflow-hidden relative">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white">
              <i className="fas fa-bullhorn animate-pulse text-sm sm:text-base md:text-lg"></i>
              <div className="flex-1 text-center overflow-hidden">
                <p className="m-0 font-medium text-xs sm:text-sm md:text-base lg:text-lg animate-fade-in line-clamp-2">
                  {updates[currentUpdateIndex]?.message}
                </p>
              </div>
              {updates.length > 1 && (
                <div className="hidden sm:flex gap-1.5">
                  {updates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentUpdateIndex(index)}
                      className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all ${
                        index === currentUpdateIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to update ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
