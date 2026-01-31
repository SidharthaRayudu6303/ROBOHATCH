'use client'
import { useState, useEffect } from 'react'
import { getCategoryProducts } from '../data/products'
import Link from 'next/link'

// Image carousel component for products
const ProductImageCarousel = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!images || images.length === 0) return null
  
  // Always show first image on server and during hydration
  if (!isMounted || images.length === 1) {
    return <img src={images[0]} alt={productName} className="w-full h-full object-cover" />
  }

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <img 
        src={images[currentIndex]} 
        alt={`${productName} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover"
      />
      <button
        onClick={prevImage}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
      >
        <i className="fas fa-chevron-left text-[8px]"></i>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
      >
        <i className="fas fa-chevron-right text-[8px]"></i>
      </button>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-1 h-1 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-2' : 'bg-white/50'
            }`}
          />
        ))}
      </span>
    </>
  )
}

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState('keychains')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [notification, setNotification] = useState('')
  const [removedProducts, setRemovedProducts] = useState([])

  // Load removed products from localStorage
  useEffect(() => {
    const loadRemovedProducts = () => {
      const stored = localStorage.getItem('removedProducts')
      if (stored) {
        setRemovedProducts(JSON.parse(stored))
      }
    }
    
    loadRemovedProducts()
    
    // Listen for products update event
    const handleProductsUpdate = () => {
      loadRemovedProducts()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdate)
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate)
  }, [])

  const categories = [
    { id: 1, icon: 'fa-key', name: 'Keychains', key: 'keychains' },
    { id: 2, icon: 'fa-mask', name: 'Superhero Models', key: 'superhero' },
    { id: 3, icon: 'fa-om', name: 'Devotional', key: 'devotional' },
    { id: 4, icon: 'fa-dice', name: 'Toys', key: 'toys' }
  ]

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(activeCategory === categoryKey ? null : categoryKey)
    setExpandedCategory(null)
  }

  const handleViewAll = (categoryKey) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey)
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = cart.findIndex(item => item.id === product.id)
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(''), 3000)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const getDisplayProducts = (categoryKey) => {
    const allProducts = getCategoryProducts(categoryKey)
    // Filter out removed products
    const activeProducts = allProducts.filter(p => !removedProducts.includes(p.id))
    return expandedCategory === categoryKey ? activeProducts : activeProducts.slice(0, 4)
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-orange-50/30 to-white" id="products">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown text-center mb-8 sm:mb-12 md:mb-16">Our Products</h2>
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12">
          {/* Left side - Circular Buttons */}
          <div className="lg:w-[220px] xl:w-[250px] flex lg:flex-col justify-center gap-4 sm:gap-5 md:gap-6 flex-wrap">
            {categories.map((category) => (
              <div key={`circle-${category.id}`} className="flex flex-col items-center gap-3">
                <button
                  onClick={() => handleCategoryClick(category.key)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl transition-all duration-300 shadow-lg hover:scale-110 ${
                    activeCategory === category.key
                      ? 'bg-primary-orange text-white shadow-[0_0_30px_rgba(242,92,5,0.6)] scale-110'
                      : 'bg-white text-primary-orange shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_25px_rgba(242,92,5,0.3)]'
                  }`}
                >
                  <i className={`fas ${category.icon}`}></i>
                </button>
                <span className="text-sm font-semibold text-dark-brown text-center max-w-[100px]">{category.name}</span>
              </div>
            ))}
          </div>

          {/* Right side - Product Cards */}
          <div className="flex-1">
            {!activeCategory && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                <i className="fas fa-hand-pointer text-6xl"></i>
                <p className="text-lg">Click on a category button to view products</p>
              </div>
            )}

            {/* Keychains */}
            {activeCategory === 'keychains' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-dark-brown flex items-center gap-3">
                    <i className="fas fa-key text-primary-orange"></i> Keychains
                  </h1>
                  <button 
                    onClick={() => handleViewAll('keychains')} 
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange flex items-center gap-2"
                  >
                    {expandedCategory === 'keychains' ? 'Show Less' : 'View All'} 
                    <i className={`fas fa-arrow-${expandedCategory === 'keychains' ? 'up' : 'right'}`}></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getDisplayProducts('keychains').map((product, index) => (
                    <div key={product.id} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 relative group active:scale-95">
                      <Link href={`/product/${product.id}`} className="block">
                        {(product.images && product.images.length > 0) || product.image ? (
                          <div className="bg-gray-100 rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden h-24 sm:h-32 relative">
                            <ProductImageCarousel 
                              images={product.images || (product.image ? [product.image] : [])} 
                              productName={product.name}
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg sm:rounded-xl p-4 sm:p-6 mb-2 sm:mb-3 flex items-center justify-center text-white text-2xl sm:text-3xl h-24 sm:h-32">
                            <i className={`fas ${product.icon}`}></i>
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-dark-brown line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight">{product.name}</h4>
                          <span className="text-primary-orange font-bold text-sm sm:text-base">₹{product.price}</span>
                        </div>
                      </Link>
                      <button 
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all duration-300 shadow-md hover:scale-110 active:scale-95"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                      >
                        <i className="fas fa-shopping-cart text-[10px] sm:text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Superhero Models */}
            {activeCategory === 'superhero' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-dark-brown flex items-center gap-3">
                    <i className="fas fa-mask text-primary-orange"></i> Superhero Models
                  </h3>
                  <button 
                    onClick={() => handleViewAll('superhero')} 
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange flex items-center gap-2"
                  >
                    {expandedCategory === 'superhero' ? 'Show Less' : 'View All'} 
                    <i className={`fas fa-arrow-${expandedCategory === 'superhero' ? 'up' : 'right'}`}></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getDisplayProducts('superhero').map((product, index) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 relative group">
                      <Link href={`/product/${product.id}`} className="block">
                        {(product.images && product.images.length > 0) || product.image ? (
                          <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-32 relative">
                            <ProductImageCarousel 
                              images={product.images || (product.image ? [product.image] : [])} 
                              productName={product.name}
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg p-6 mb-3 flex items-center justify-center text-white text-3xl h-32">
                            <i className={`fas ${product.icon}`}></i>
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-dark-brown line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                          <span className="text-primary-orange font-bold text-base">₹{product.price}</span>
                        </div>
                      </Link>
                      <button 
                        className="absolute bottom-4 right-4 w-9 h-9 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all duration-300 shadow-md hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                      >
                        <i className="fas fa-shopping-cart text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Devotional */}
            {activeCategory === 'devotional' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-dark-brown flex items-center gap-3">
                    <i className="fas fa-om text-primary-orange"></i> Devotional
                  </h3>
                  <button 
                    onClick={() => handleViewAll('devotional')} 
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange flex items-center gap-2"
                  >
                    {expandedCategory === 'devotional' ? 'Show Less' : 'View All'} 
                    <i className={`fas fa-arrow-${expandedCategory === 'devotional' ? 'up' : 'right'}`}></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getDisplayProducts('devotional').map((product, index) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 relative group">
                      <Link href={`/product/${product.id}`} className="block">
                        {(product.images && product.images.length > 0) || product.image ? (
                          <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-32 relative">
                            <ProductImageCarousel 
                              images={product.images || (product.image ? [product.image] : [])} 
                              productName={product.name}
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg p-6 mb-3 flex items-center justify-center text-white text-3xl h-32">
                            <i className={`fas ${product.icon}`}></i>
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-dark-brown line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                          <span className="text-primary-orange font-bold text-base">₹{product.price}</span>
                        </div>
                      </Link>
                      <button 
                        className="absolute bottom-4 right-4 w-9 h-9 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all duration-300 shadow-md hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                      >
                        <i className="fas fa-shopping-cart text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toys */}
            {activeCategory === 'toys' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-dark-brown flex items-center gap-3">
                    <i className="fas fa-dice text-primary-orange"></i> Toys
                  </h3>
                  <button 
                    onClick={() => handleViewAll('toys')} 
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange flex items-center gap-2"
                  >
                    {expandedCategory === 'toys' ? 'Show Less' : 'View All'} 
                    <i className={`fas fa-arrow-${expandedCategory === 'toys' ? 'up' : 'right'}`}></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getDisplayProducts('toys').map((product, index) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 relative group">
                      <Link href={`/product/${product.id}`} className="block">
                        {(product.images && product.images.length > 0) || product.image ? (
                          <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-32 relative">
                            <ProductImageCarousel 
                              images={product.images || (product.image ? [product.image] : [])} 
                              productName={product.name}
                            />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg p-6 mb-3 flex items-center justify-center text-white text-3xl h-32">
                            <i className={`fas ${product.icon}`}></i>
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-dark-brown line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                          <span className="text-primary-orange font-bold text-base">₹{product.price}</span>
                        </div>
                      </Link>
                      <button 
                        className="absolute bottom-4 right-4 w-9 h-9 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all duration-300 shadow-md hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                      >
                        <i className="fas fa-shopping-cart text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-[slideUp_0.3s_ease-out] z-50">
          <i className="fas fa-check-circle"></i>
          {notification}
        </div>
      )}
    </section>
  )
}
