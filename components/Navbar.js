'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar({ hideLogin = false, hideMenu = false, hideCart = false }) {
  const [cartCount, setCartCount] = useState(0)
  const [updates, setUpdates] = useState([])
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0)

  useEffect(() => {
    // Load cart count on mount
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

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)
    }
  }

  const loadUpdates = () => {
    if (typeof window !== 'undefined') {
      const storedUpdates = JSON.parse(localStorage.getItem('siteUpdates') || '[]')
      const activeUpdates = storedUpdates.filter(update => update.active)
      setUpdates(activeUpdates)
    }
  }

  return (
    <>
      <nav className="sticky top-0 bg-white/98 backdrop-blur-md shadow-md z-[1000] transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-extrabold text-black tracking-wide flex items-center gap-3 no-underline transition-opacity duration-300 hover:opacity-80">
              <Image src="/logo.png" alt="ROBOHATCH Logo" width={50} height={50} className="rounded-full border-2 border-primary-orange p-[5px] bg-white shadow-[0_2px_10px_rgba(242,92,5,0.3)] transition-transform duration-300 hover:scale-105" />
              <span>ROBOHATCH</span>
            </Link>
            {!hideMenu && (
              <ul className="flex list-none gap-8">
                <li><Link href="/" className="no-underline text-dark-brown font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Home</Link></li>
                <li><Link href="/#services" className="no-underline text-dark-brown font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Categories</Link></li>
                <li><Link href="/#products" className="no-underline text-dark-brown font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Products</Link></li>
                <li><Link href="/about" className="no-underline text-dark-brown font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">About</Link></li>
                <li><Link href="/contact" className="no-underline text-dark-brown font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-orange after:transition-[width] after:duration-300 hover:text-primary-orange hover:after:w-full">Contact</Link></li>
              </ul>
            )}
            <div className="flex items-center gap-6">
              {!hideCart && (
                <Link href="/cart" className="relative text-dark-brown text-[1.3rem] transition-colors duration-300 no-underline hover:text-primary-orange">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="absolute top-[-8px] right-[-10px] bg-primary-orange text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[0.7rem] font-bold">{cartCount}</span>
                </Link>
              )}
              {!hideLogin && (
                <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-primary-orange to-hover-orange text-white no-underline rounded-full font-semibold text-[0.95rem] shadow-[0_4px_15px_rgba(242,92,5,0.3)] transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-[left] before:duration-500 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] hover:before:left-full active:translate-y-0">
                  <i className="fas fa-user text-[1.1rem] animate-pulse-custom"></i>
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Updates Banner */}
      {updates.length > 0 && (
        <div className="bg-gradient-to-r from-primary-orange via-hover-orange to-primary-orange py-2.5 px-5 shadow-md overflow-hidden relative">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-center gap-3 text-white">
              <i className="fas fa-bullhorn animate-pulse"></i>
              <div className="flex-1 text-center overflow-hidden">
                <p className="m-0 font-medium text-sm md:text-base animate-fade-in">
                  {updates[currentUpdateIndex]?.message}
                </p>
              </div>
              {updates.length > 1 && (
                <div className="flex gap-1.5">
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
