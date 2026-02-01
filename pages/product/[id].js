'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import { apiGet } from '../../lib/api'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      const productData = await apiGet(`/products/${id}`)
      setProduct(productData)
    } catch (error) {
      console.error('Failed to load product:', error)
      setProduct(null)
    }
  }

  const addToCart = async () => {
    if (!product) return
    
    try {
      // Import addToCart from lib/api will be added via cartHelper
      const { addToCart: apiAddToCart } = await import('../../lib/api')
      await apiAddToCart(product.id, quantity)
      setNotification(`${product.name} added to cart!`)
      setTimeout(() => setNotification(''), 3000)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setNotification('Please login to add items to cart')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-[120px] pb-20 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <i className="fas fa-spinner fa-spin text-5xl text-primary-orange"></i>
              <p className="text-xl text-[#666]">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{product.name} - ROBOHATCH</title>
        <meta name="description" content={product.description} />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen pt-[100px] sm:pt-[110px] md:pt-[120px] pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-6 sm:mb-8 text-[#666]">
            <Link href="/" className="hover:text-primary-orange transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link href="/#products" className="hover:text-primary-orange transition-colors">Products</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-[#2c3e50] font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            <div className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-[15px] sm:rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 sm:p-12 md:p-16 flex items-center justify-center">
              <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-br from-primary-orange/20 to-[#ff3b29]/20 rounded-full flex items-center justify-center">
                <i className={`fas ${product.icon} text-[100px] sm:text-[120px] md:text-[150px] text-primary-orange`}></i>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2c3e50] mb-4 sm:mb-5 md:mb-6">{product.name}</h1>
              
              <div className="mb-6 sm:mb-7 md:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-orange">₹{product.price}</span>
                <span className="block text-xs sm:text-sm text-[#888] mt-2">Inclusive of all taxes</span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Description</h3>
                <p className="text-[#555] leading-relaxed text-lg">{product.description}</p>
              </div>

              <div className="mb-6 sm:mb-7 md:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2c3e50] mb-3 sm:mb-4">Features</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-3 text-sm sm:text-base text-[#555]">
                    <i className="fas fa-check-circle text-[#4caf50] text-lg sm:text-xl"></i>
                    High-quality 3D printed material
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-[#555]">
                    <i className="fas fa-check-circle text-[#4caf50] text-lg sm:text-xl"></i>
                    Durable and long-lasting
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-[#555]">
                    <i className="fas fa-check-circle text-[#4caf50] text-lg sm:text-xl"></i>
                    Customization available
                  </li>
                  <li className="flex items-center gap-3 text-sm sm:text-base text-[#555]">
                    <i className="fas fa-check-circle text-[#4caf50] text-lg sm:text-xl"></i>
                    Eco-friendly production
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex flex-col w-full sm:w-auto">
                  <label className="text-sm font-medium text-[#2c3e50] mb-2">Quantity</label>
                  <div className="flex items-center gap-4 bg-white rounded-lg shadow-md px-2 py-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-primary-orange text-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-orange/10 rounded-lg"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="text-lg sm:text-xl font-semibold text-[#2c3e50] min-w-[40px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-primary-orange text-xl transition-all hover:bg-primary-orange/10 rounded-lg"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                <button 
                  className="flex-1 w-full sm:w-auto bg-gradient-to-r from-primary-orange to-[#ff3b29] text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-[12px] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,94,77,0.4)] flex items-center justify-center gap-3" 
                  onClick={addToCart}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 bg-white rounded-xl p-5 sm:p-6 shadow-md">
                <div className="flex items-center gap-4 text-[#555]">
                  <i className="fas fa-truck text-primary-orange text-xl"></i>
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-4 text-[#555]">
                  <i className="fas fa-shield-alt text-primary-orange text-xl"></i>
                  <span>7 days return policy</span>
                </div>
                <div className="flex items-center gap-4 text-[#555]">
                  <i className="fas fa-headset text-primary-orange text-xl"></i>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 bg-[#4caf50] text-white px-8 py-5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] z-[1000] animate-[slideIn_0.3s_ease] flex items-center gap-3">
          <i className="fas fa-check-circle text-2xl"></i>
          {notification}
        </div>
      )}
      
      <Footer />
    </>
  )
}
