'use client'
import { useState } from 'react'

export default function Products() {
  const [cartCount, setCartCount] = useState(0)
  const [notification, setNotification] = useState('')

  const products = [
    { icon: 'fa-lightbulb', name: 'Geometric Lamp', category: 'Lamps', price: '₹1,299', badge: 'New' },
    { icon: 'fa-om', name: 'Ganesha Idol', category: 'Devotional Items', price: '₹899', badge: '' },
    { icon: 'fa-key', name: 'Custom Keychain Set', category: 'Keychains', price: '₹299', badge: 'Popular' },
    { icon: 'fa-leaf', name: 'Modern Planter', category: 'Flower Pots', price: '₹599', badge: '' },
    { icon: 'fa-praying-hands', name: 'Buddha Statue', category: 'Idols', price: '₹1,499', badge: '' },
    { icon: 'fa-gem', name: 'Desk Organizer', category: 'Accessories', price: '₹799', badge: 'New' },
  ]

  const handleAddToCart = (productName) => {
    setCartCount(prev => prev + 1)
    setNotification(`${productName} added to cart!`)
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50" id="products">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown text-center mb-3 sm:mb-4 opacity-0 animate-[slideUp_0.6s_ease-out_forwards]">Featured Products</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-10 md:mb-12 opacity-0 animate-[slideUp_0.6s_ease-out_forwards] [animation-delay:100ms]">Handpicked bestsellers and new arrivals</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {products.map((product, index) => (
            <div 
              key={product.name} 
              className="bg-gradient-to-br from-white to-orange-50/30 rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/40 opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-orange to-hover-orange h-64 flex items-center justify-center text-white text-6xl">
                  <i className={`fas ${product.icon}`}></i>
                </div>
                {product.badge && <span className="absolute top-4 right-4 bg-white text-primary-orange px-4 py-2 rounded-full text-sm font-bold shadow-md">{product.badge}</span>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-brown mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-orange">{product.price}</span>
                  <button 
                    className="w-12 h-12 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all duration-300 shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:scale-110"
                    onClick={() => handleAddToCart(product.name)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-[slideUp_0.3s_ease-out] z-50">
          {notification}
        </div>
      )}
    </section>
  )
}
