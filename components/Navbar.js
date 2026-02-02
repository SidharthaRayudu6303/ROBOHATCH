'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { getCart } from '../lib/api'

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileDropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    // 🔒 SECURITY: Load cart count from backend only (no localStorage)
    updateCartCount()
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      updateCartCount()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [isAuthenticated])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const target = event.target
        // Don't close if clicking the hamburger button
        if (!target.closest('[data-mobile-toggle]')) {
          setMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setProfileDropdownOpen(false)
  }, [router.asPath])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // ✅ BACKEND CART COUNT - Cookie-based auth, no localStorage
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

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  // Handle logout with cleanup
  const handleLogout = async () => {
    setProfileDropdownOpen(false)
    await logout()
    setCartCount(0)
    router.push('/')
  }

  // Get user initials for avatar
  const getUserInitial = () => {
    if (!user?.name) return 'U'
    return user.name.charAt(0).toUpperCase()
  }

  return (
    <>
      {/* 🎯 MAIN NAVBAR - Flipkart/Amazon Style */}
      <nav className="sticky top-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* LEFT: Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <Image 
                src="/logo.png" 
                alt="ROBOHATCH" 
                width={40} 
                height={40} 
                className="w-10 h-10 rounded-full border-2 border-primary-orange bg-white shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">
                ROBO<span className="text-primary-orange">HATCH</span>
              </span>
            </Link>

            {/* CENTER: Search Bar (Desktop) */}
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for keychains, anime merch, gifts..."
                  className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-orange transition-colors text-gray-700 placeholder-gray-400"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-orange text-white px-4 py-1.5 rounded-md hover:bg-hover-orange transition-colors"
                  aria-label="Submit search"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            {/* RIGHT: Auth & Cart (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Loading State - Prevents flickering */}
              {authLoading && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              )}

              {/* Guest State - Before Login */}
              {!authLoading && !isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2 text-primary-orange border border-primary-orange rounded-md font-medium hover:bg-orange-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2 bg-primary-orange text-white rounded-md font-medium hover:bg-hover-orange transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    href="/cart" 
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <i className="fas fa-shopping-cart text-2xl text-gray-700"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Authenticated State - After Login */}
              {!authLoading && isAuthenticated && (
                <>
                  {/* Cart Icon with Badge */}
                  <Link 
                    href="/cart" 
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={`Cart with ${cartCount} items`}
                  >
                    <i className="fas fa-shopping-cart text-2xl text-gray-700"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Orders Link */}
                  <Link
                    href="/my-orders"
                    className="px-4 py-2 text-gray-700 font-medium hover:text-primary-orange transition-colors"
                  >
                    Orders
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="User menu"
                      aria-expanded={profileDropdownOpen}
                    >
                      <div className="w-9 h-9 bg-primary-orange text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {getUserInitial()}
                      </div>
                      <span className="font-medium text-gray-700 max-w-[100px] truncate">
                        {user?.name || 'User'}
                      </span>
                      <i className={`fas fa-chevron-down text-xs text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <i className="fas fa-user w-5 text-gray-600"></i>
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/my-orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <i className="fas fa-box w-5 text-gray-600"></i>
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="fas fa-sign-out-alt w-5"></i>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile: Search + Hamburger */}
            <div className="flex md:hidden items-center gap-3">
              {/* Mobile Search Icon */}
              <button
                onClick={() => {
                  const query = prompt('Search for products:')
                  if (query?.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <i className="fas fa-search text-xl text-gray-700"></i>
              </button>

              {/* Mobile Cart Icon */}
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-shopping-cart text-xl text-gray-700"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Toggle */}
              <button
                data-mobile-toggle
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-700`}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU - Bottom Sheet Style */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            ref={mobileMenuRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <i className="fas fa-times text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-4">
              {/* User Info Section - If Authenticated */}
              {isAuthenticated && user && (
                <div className="bg-gradient-to-r from-primary-orange to-hover-orange text-white rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white text-primary-orange rounded-full flex items-center justify-center font-bold text-lg">
                      {getUserInitial()}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user.name}</p>
                      <p className="text-sm text-white/80">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Login Prompt */}
              {!authLoading && !isAuthenticated && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 mb-3">Sign in for the best experience</p>
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 text-center px-4 py-2.5 bg-primary-orange text-white rounded-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      className="flex-1 text-center px-4 py-2.5 border-2 border-primary-orange text-primary-orange rounded-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {/* Menu Links */}
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-home w-5 text-gray-600"></i>
                  <span>Home</span>
                </Link>

                <Link
                  href="/#services"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-th-large w-5 text-gray-600"></i>
                  <span>Categories</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      href="/my-orders"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fas fa-box w-5 text-gray-600"></i>
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fas fa-user w-5 text-gray-600"></i>
                      <span>My Profile</span>
                    </Link>
                  </>
                )}

                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-shopping-cart w-5 text-gray-600"></i>
                  <span>Cart ({cartCount})</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-info-circle w-5 text-gray-600"></i>
                  <span>About</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-envelope w-5 text-gray-600"></i>
                  <span>Contact</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <i className="fas fa-sign-out-alt w-5"></i>
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add animation for mobile menu */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
