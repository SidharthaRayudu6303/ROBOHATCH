'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import { getProducts, addToCart as apiAddToCart } from '../lib/api'

export default function Keychains() {
  const [notification, setNotification] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts('keychains')
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
      <Head>
        <title>Keychains - ROBOHATCH</title>
        <meta name="description" content="Custom 3D printed keychains at ROBOHATCH" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen pt-20 bg-light-gray">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-brown mb-4">
              <i className="fas fa-key mr-3"></i> Keychains
            </h1>
            <p className="text-lg text-gray-600">Personalized and custom 3D printed keychains</p>
          </div>

          {loading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-primary-orange"></i>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-soft-peach to-primary-orange overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-key text-6xl text-white"></i>
                      </div>
                    )}
                  </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark-brown mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-orange">₹{product.price}</span>
                    <button 
                      className="px-6 py-3 bg-gradient-to-br from-primary-orange to-hover-orange text-white rounded-full font-semibold shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] transition-all duration-300 flex items-center gap-2"
                      onClick={() => addToCart(product)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-3 animate-slideInRight z-50">
          <i className="fas fa-check-circle text-xl"></i>
          {notification}
        </div>
      )}
      
      <Footer />
    </>
  )
}
