'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { getProducts, addToCart as apiAddToCart } from '../lib/api'

export default function HomeDecor() {
  const [notification, setNotification] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    
    const handleProductsUpdate = () => {
      loadProducts()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdate)
    return () => window.removeEventListener('productsUpdated', handleProductsUpdate)
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts('homedecor')
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    try {
      await apiAddToCart(product.id, 1)
      setNotification(`${product.name} added to cart!`)
      setTimeout(() => setNotification(''), 3000)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setNotification('Failed to add to cart. Please try again.')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-light-gray">
        <div className="bg-gradient-to-r from-primary-orange to-hover-orange py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <i className="fas fa-image text-6xl text-white mb-4"></i>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Home Decor</h1>
            <p className="text-xl text-white/90">Beautiful decorative items to enhance your living space</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-soft-peach to-primary-orange overflow-hidden cursor-pointer">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-image text-6xl text-white"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-dark-brown mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                    <p className="text-2xl font-bold text-primary-orange">₹{product.price}</p>
                  </div>
                </Link>
                <button 
                  className="w-full px-4 py-3 bg-gradient-to-br from-primary-orange to-hover-orange text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => addToCart(product)}
                >
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg z-50 animate-slideInRight">
          {notification}
        </div>
      )}
      
      <Footer />
    </>
  )
}
