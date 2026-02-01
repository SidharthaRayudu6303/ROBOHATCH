'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])

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

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  // ✅ CORRECT: Get totals from backend (if using API)
  // For legacy compatibility, keep calculations but add warning comment
  // TODO: Replace with backend API call - cartData.subtotal, cartData.total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  // ⚠️ WARNING: This page uses client-side calculations. Use pages/cart.js instead.

  return (
    <>
      <Head>
        <title>Shopping Cart - ROBOHATCH</title>
        <meta name="description" content="Your shopping cart at ROBOHATCH" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen pt-20 bg-light-gray">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-brown mb-2">Shopping Cart</h1>
            <p className="text-lg text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
              <i className="fas fa-shopping-cart text-8xl text-primary-orange/30 mb-6"></i>
              <h2 className="text-3xl font-bold text-dark-brown mb-4">Your cart is empty</h2>
              <p className="text-lg text-gray-600 mb-8">Add some amazing 3D printed products to get started!</p>
              <Link href="/" className="px-8 py-4 bg-gradient-to-br from-primary-orange to-hover-orange text-white rounded-full font-semibold shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] transition-all duration-300">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-soft-peach to-primary-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${item.icon || 'fa-box'} text-5xl text-white`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-dark-brown mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <button 
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Quantity</label>
                        <div className="flex items-center gap-2 bg-light-gray rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-orange hover:text-white transition-colors flex items-center justify-center"
                          >
                            <i className="fas fa-minus text-sm"></i>
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md bg-white hover:bg-primary-orange hover:text-white transition-colors flex items-center justify-center"
                          >
                            <i className="fas fa-plus text-sm"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-orange">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-dark-brown mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (8%)</span>
                      <span className="font-semibold">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-200 my-4"></div>
                  <div className="flex justify-between text-xl font-bold text-dark-brown mb-6">
                    <span>Total</span>
                    <span className="text-primary-orange">₹{total.toFixed(2)}</span>
                  </div>
                  
                  <button className="w-full py-4 bg-gradient-to-br from-primary-orange to-hover-orange text-white rounded-full font-semibold text-lg shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mb-4">
                    Proceed to Checkout
                    <i className="fas fa-arrow-right"></i>
                  </button>
                  
                  <Link href="/" className="flex items-center justify-center gap-2 text-primary-orange hover:text-hover-orange font-medium transition-colors">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">We accept</p>
                    <div className="flex gap-3 text-3xl text-gray-400">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-paypal"></i>
                      <i className="fab fa-cc-amex"></i>
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
