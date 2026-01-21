'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    // Load cart from localStorage
    loadCart()
    
    // Listen for cart updates
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  // Constant delivery charge of ₹100
  const deliveryCharges = 100
  // Free delivery for orders above ₹1000
  const shipping = subtotal >= 1000 ? 0 : deliveryCharges
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <>
      <Head>
        <title>Shopping Cart - ROBOHATCH</title>
        <meta name="description" content="Your shopping cart at ROBOHATCH" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-12">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-dark-brown mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-[20px] p-16 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <i className="fas fa-shopping-cart text-7xl text-gray-300 mb-6"></i>
              <h2 className="text-2xl font-bold text-dark-brown mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some amazing 3D printed products to get started!</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-primary-orange text-white px-8 py-4 rounded-full font-semibold text-lg shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange transition-all duration-300 hover:-translate-y-0.5">
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-[20px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary-orange to-hover-orange rounded-xl flex items-center justify-center text-white text-5xl">
                          <i className={`fas ${item.icon || 'fa-box'}`}></i>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-dark-brown mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="h-0.5 w-16 bg-gradient-to-r from-primary-orange to-transparent my-2"></div>
                          <p className="text-sm text-gray-600">
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
                              className="w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-dark-brown hover:bg-primary-orange hover:text-white"
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="text-lg font-bold text-dark-brown min-w-[30px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-center text-dark-brown hover:bg-primary-orange hover:text-white"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <label className="text-sm text-gray-600 block mb-1">Price</label>
                          <p className="text-2xl font-bold text-primary-orange">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
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
