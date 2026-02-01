'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import { getCart, updateCartItem, removeFromCart } from '../lib/api'

export default function Cart() {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCart()
    const handleCartUpdate = () => {
      loadCart()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const loadCart = async () => {
    setLoading(true)
    setError(null)
    try {
      // ✅ Fetch cart from backend with calculated totals
      const data = await getCart()
      setCartData(data)
    } catch (err) {
      console.error('Failed to load cart:', err)
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      // ✅ Update on backend - backend recalculates totals
      await updateCartItem(itemId, { quantity: newQuantity })
      await loadCart() // Reload to get updated totals from backend
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      console.error('Failed to update quantity:', err)
      alert('Failed to update item quantity')
    }
  }

  const removeItem = async (itemId) => {
    try {
      // ✅ Remove from backend - backend recalculates totals
      await removeFromCart(itemId)
      await loadCart() // Reload to get updated totals from backend
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert('Failed to remove item from cart')
    }
  }

  // ✅ No price calculations here - all come from backend
  const cartItems = cartData?.items || []
  const subtotal = cartData?.subtotal || 0
  const shipping = cartData?.shipping || 0
  const tax = cartData?.tax || 0
  const total = cartData?.total || 0

  return (
    <>
      <Head>
        <title>Shopping Cart - ROBOHATCH</title>
        <meta name="description" content="Your shopping cart at ROBOHATCH" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-6 sm:py-8 md:py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
            <div className="mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown mb-2">Shopping Cart</h1>
              <p className="text-sm sm:text-base text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <i className="fas fa-spinner fa-spin text-5xl text-primary-orange"></i>
              </div>
            ) : error ? (
              <div className="bg-white rounded-[20px] p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-6"></i>
                <h2 className="text-2xl font-bold text-dark-brown mb-3">Error Loading Cart</h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button 
                  onClick={loadCart}
                  className="inline-flex items-center gap-2 bg-primary-orange text-white px-8 py-4 rounded-full font-semibold shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange transition-all"
                >
                  <i className="fas fa-sync-alt"></i>
                  Retry
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded-[20px] p-8 sm:p-12 md:p-16 lg:p-20 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <i className="fas fa-shopping-cart text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-300 mb-4 sm:mb-6 md:mb-8"></i>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-brown mb-2 sm:mb-3">Your cart is empty</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 md:mb-10">Add some amazing 3D printed products to get started!</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-primary-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange transition-all duration-300 hover:-translate-y-0.5">
                  <i className="fas fa-arrow-left"></i>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[2fr_1fr] gap-6 sm:gap-8 lg:gap-10">
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-white rounded-[20px] p-4 sm:p-6 md:p-7 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-gradient-to-br from-primary-orange to-hover-orange rounded-xl flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl">
                            <i className={`fas ${item.icon || 'fa-box'}`}></i>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-dark-brown mb-2 truncate">{item.name}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{item.description}</p>
                            <div className="h-0.5 w-12 sm:w-16 bg-gradient-to-r from-primary-orange to-transparent my-2"></div>
                            <p className="text-xs sm:text-sm text-gray-600">
                              <i className="fas fa-truck text-primary-orange mr-1"></i>
                              Delivery: <span className="font-semibold text-dark-brown">₹100.00</span>
                            </p>
                          </div>
                          <button 
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm transition-colors duration-300 self-start"
                            onClick={() => removeItem(item.id)}
                          >
                            <i className="fas fa-trash"></i> Remove
                          </button>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <label className="text-sm text-gray-600 block mb-2">Quantity</label>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-dark-brown hover:bg-primary-orange hover:text-white active:scale-90"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              <span className="text-lg sm:text-lg font-bold text-dark-brown min-w-[35px] sm:min-w-[30px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-center text-dark-brown hover:bg-primary-orange hover:text-white active:scale-90"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 text-right">
                            <label className="text-xs sm:text-sm text-gray-600 block mb-1">Price</label>
                            <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-primary-orange">₹{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs sm:text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)] sticky top-24">
                    <h2 className="text-2xl font-bold text-dark-brown mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Charges</span>
                        <span className={`font-semibold ${subtotal >= 1000 ? 'line-through text-gray-400' : ''}`}>
                          ₹{deliveryCharges.toFixed(2)}
                        </span>
                      </div>
                      {subtotal >= 1000 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 -mt-2">
                          <p className="text-green-700 text-sm font-semibold flex items-center gap-2">
                            <i className="fas fa-check-circle"></i>
                            Free Delivery! (Orders above ₹1000)
                          </p>
                        </div>
                      )}
                      {subtotal < 1000 && subtotal > 0 && (
                        <div className="bg-orange-50 border border-primary-orange/30 rounded-lg p-3 -mt-2">
                          <p className="text-primary-orange text-sm font-semibold">
                            <i className="fas fa-info-circle mr-1"></i>
                            Add ₹{(1000 - subtotal).toFixed(2)} more for FREE delivery!
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (8%)</span>
                        <span className="font-semibold">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="h-0.5 w-full bg-gradient-to-r from-primary-orange via-hover-orange to-primary-orange mt-4 mb-4"></div>
                      <div className="flex justify-between text-xl font-bold text-dark-brown">
                        <span>Total</span>
                        <span className="text-primary-orange">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Link href="/checkout" className="w-full bg-primary-orange text-white px-6 py-4 rounded-full font-bold text-lg shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] flex items-center justify-center gap-3 mb-4">
                      Proceed to Checkout
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                    
                    <Link href="/" className="w-full flex items-center justify-center gap-3 text-primary-orange hover:text-hover-orange font-semibold text-sm transition-colors duration-300">
                      <i className="fas fa-arrow-left"></i>
                      Continue Shopping
                    </Link>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3 text-center">We accept</p>
                      <div className="flex justify-center gap-4 text-3xl text-gray-400">
                        <i className="fab fa-cc-visa hover:text-primary-orange transition-colors duration-300"></i>
                        <i className="fab fa-cc-mastercard hover:text-primary-orange transition-colors duration-300"></i>
                        <i className="fab fa-cc-paypal hover:text-primary-orange transition-colors duration-300"></i>
                        <i className="fab fa-cc-amex hover:text-primary-orange transition-colors duration-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      
      <Footer />
    </>
  )
}
