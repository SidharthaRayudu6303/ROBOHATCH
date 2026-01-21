'use client'
import { useState, useEffect } from 'react'
import { getCategoryProducts } from '../data/products'
import Link from 'next/link'

export default function Categories() {
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
    { 
      icon: 'fa-key', 
      title: 'Keychains', 
      key: 'keychains',
      description: 'Personalized accessories for everyday',
      link: '/keychains'
    },
    { 
      icon: 'fa-mask', 
      title: 'Superhero Models', 
      key: 'superhero',
      description: 'Collectible superhero action figures',
      link: '/superhero-models'
    },
    { 
      icon: 'fa-om', 
      title: 'Devotional Idols', 
      key: 'devotional',
      description: 'Sacred symbols crafted with precision',
      link: '/devotional'
    },
    { 
      icon: 'fa-dice', 
      title: 'Toys & Games', 
      key: 'toys',
      description: 'Fun and educational 3D printed toys',
      link: '/toys'
    },
    { 
      icon: 'fa-lightbulb', 
      title: 'Lamps & Lighting', 
      key: 'lamps',
      description: 'Illuminate your space uniquely',
      link: '/lamps'
    },
    { 
      icon: 'fa-om', 
      title: 'Religious Idols', 
      key: 'idols',
      description: 'Divine idols for worship',
      link: '/idols'
    },
    { 
      icon: 'fa-seedling', 
      title: 'Flowerpots', 
      key: 'flowerpots',
      description: 'Beautiful planters for your plants',
      link: '/flowerpots'
    },
    { 
      icon: 'fa-briefcase', 
      title: 'Office Supplies', 
      key: 'office',
      description: 'Professional desk accessories',
      link: '/office'
    },
    { 
      icon: 'fa-mobile-alt', 
      title: 'Phone Accessories', 
      key: 'phoneaccessories',
      description: 'Must-have mobile accessories',
      link: '/phoneaccessories'
    },
    { 
      icon: 'fa-image', 
      title: 'Home Decor', 
      key: 'homedecor',
      description: 'Beautiful decorative items for your home',
      link: '/homedecor'
    },
    { 
      icon: 'fa-gem', 
      title: 'Jewelry & Accessories', 
      key: 'jewelry',
      description: 'Unique custom jewelry pieces',
      link: '/jewelry'
    }
  ]

  const [expandedCategory, setExpandedCategory] = useState(null)

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index)
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

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50" id="categories">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown text-center mb-8 sm:mb-12 md:mb-16">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">{
          {categories.map((category, index) => {
            const products = getCategoryProducts(category.key).filter(p => !removedProducts.includes(p.id))
            
            return (
              <div 
                key={category.title} 
                className="bg-gradient-to-br from-white to-orange-50/20 rounded-[20px] p-8 shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:from-white hover:to-orange-100/30 opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-4xl mb-6 mx-auto transition-transform duration-300 hover:scale-110">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <h3 className="text-2xl font-bold text-dark-brown mb-3 text-center">{category.title}</h3>
                <p className="text-gray-600 mb-6 text-center">{category.description}</p>
                <div className="flex flex-col gap-3">
                  <button 
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-gray-100 text-dark-brown hover:bg-gray-200 flex items-center justify-center gap-2"
                    onClick={() => toggleCategory(index)}
                  >
                    {expandedCategory === index ? 'Hide Products' : 'View Products'}
                    <i className={`fas fa-chevron-${expandedCategory === index ? 'up' : 'down'}`}></i>
                  </button>
                  <Link href={category.link} className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange flex items-center justify-center gap-2">
                    View All <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
                
                {expandedCategory === index && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {products.map(product => (
                      <div key={product.id} className="bg-gray-50 rounded-xl p-4 relative group hover:shadow-md transition-shadow duration-300">
                        <Link href={`/product/${product.id}`} className="block">
                          <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg p-4 mb-3 flex items-center justify-center text-white text-2xl h-24">
                            <i className={`fas ${product.icon}`}></i>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-dark-brown line-clamp-2">{product.name}</h4>
                            <span className="text-primary-orange font-bold text-sm">₹{product.price}</span>
                          </div>
                        </Link>
                        <button 
                          className="absolute bottom-4 right-4 w-8 h-8 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-colors duration-300 shadow-md"
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
                )}
              </div>
            )
          })}
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

