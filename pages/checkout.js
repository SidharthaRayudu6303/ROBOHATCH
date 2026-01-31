'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { cartApi } from '../utils/cartApi'
import { ordersApi } from '../utils/ordersApi'

export default function Checkout() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    orderNotes: ''
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCharges = 100
  const shipping = subtotal >= 1000 ? 0 : deliveryCharges
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    }
  }, [isAuthenticated])

  const loadCart = () => {
    try {
      setIsLoadingCart(true)
      setError(null)
      if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
        
        if (!cart || cart.length === 0) {
          router.push('/cart')
        }
      }
    } catch (err) {
      setError('Failed to load cart')
    } finally {
      setIsLoadingCart(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits'
    
    // Shipping Address
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    
    // Card Details (if card payment)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits'
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required'
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3-4 digits'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes,
      }
      
      const result = await ordersApi.checkout(orderData)
      
      setOrderId(result.orderId)
      setOrderStatus('success')
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
      setOrderStatus('failed')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading || isLoadingCart) {
    return (
      <>
        <Head>
          <title>Checkout - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-orange mb-4"></div>
            <p className="text-gray-600 text-lg">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Checkout - ROBOHATCH</title>
        <meta name="description" content="Complete your purchase at ROBOHATCH" />
      </Head>
      
      <Navbar />
      
      {error && !orderStatus && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {orderStatus && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.4s_ease-out]">
            {orderStatus === 'success' ? (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[scaleIn_0.5s_ease-out]">
                    <i className="fas fa-check-circle text-green-600 text-4xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-dark-brown mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mb-4">Thank you for your purchase</p>
                  <div className="bg-orange-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-1">Order ID</p>
                    <p className="text-lg font-bold text-primary-orange">#{orderId}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    A confirmation email has been sent to {formData.email}
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push(`/payment?orderId=${orderId}`)}
                      className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary-orange hover:text-primary-orange transition-all"
                    >
                      View My Orders
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[scaleIn_0.5s_ease-out]">
                    <i className="fas fa-times-circle text-red-600 text-4xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-dark-brown mb-2">Order Failed</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't process your order. Please try again or contact support.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setOrderStatus(null)
                        setIsProcessing(false)
                      }}
                      className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => router.push('/contact')}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary-orange hover:text-primary-orange transition-all"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-5 sm:py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-5">
          <div className="mb-5 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown mb-2">Checkout</h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Link href="/cart" className="hover:text-primary-orange transition-colors">Cart</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-primary-orange font-semibold">Checkout</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[2fr_1fr] gap-5 sm:gap-8 lg:gap-10">
              {/* Left Column - Forms */}
              <div className="space-y-5 sm:space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-6 sm:p-6 md:p-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-orange text-white rounded-full flex items-center justify-center text-sm sm:text-base">
                      <span className="font-bold">1</span>
                    </div>
                    <span className="text-base sm:text-xl md:text-2xl">Personal Information</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                        placeholder="9876543210"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-[20px] p-5 sm:p-6 md:p-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-orange text-white rounded-full flex items-center justify-center text-sm sm:text-base">
                      <span className="font-bold">2</span>
                    </div>
                    <span className="text-base sm:text-xl md:text-2xl">Shipping Address</span>
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                        placeholder="123 Main Street, Apartment 4B"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.city ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                          placeholder="Mumbai"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.state ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                          placeholder="Maharashtra"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.zipCode ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                          placeholder="400001"
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-orange transition-colors bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-[20px] p-5 sm:p-6 md:p-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-orange text-white rounded-full flex items-center justify-center text-sm sm:text-base">
                      <span className="font-bold">3</span>
                    </div>
                    <span className="text-base sm:text-xl md:text-2xl">Payment Method</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                      className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'card' ? 'border-primary-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <i className="fas fa-credit-card text-2xl mb-2"></i>
                      <p className="font-semibold">Credit/Debit Card</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                      className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'upi' ? 'border-primary-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <i className="fas fa-mobile-alt text-2xl mb-2"></i>
                      <p className="font-semibold">UPI</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                      className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'cod' ? 'border-primary-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <i className="fas fa-money-bill-wave text-2xl mb-2"></i>
                      <p className="font-semibold">Cash on Delivery</p>
                    </button>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-6 pt-6 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.cardNumber ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.cardName ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                          placeholder="JOHN DOE"
                        />
                        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.expiryDate ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.cvv ? 'border-red-500' : 'border-gray-200 focus:border-primary-orange'}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="pt-6 border-t border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-orange transition-colors"
                        placeholder="yourname@upi"
                      />
                      <p className="text-xs text-gray-500 mt-2">You can also scan QR code after placing order</p>
                    </div>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <i className="fas fa-info-circle text-amber-600 mr-2"></i>
                        <span className="text-sm text-amber-800">Pay with cash when your order is delivered to your doorstep.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-[20px] p-5 sm:p-6 md:p-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                  <h3 className="text-lg sm:text-xl font-bold text-dark-brown mb-3 sm:mb-4">Order Notes (Optional)</h3>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-orange transition-colors resize-none"
                    placeholder="Any special instructions for your order..."
                  ></textarea>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)] lg:sticky lg:top-24">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-4 sm:mb-6">Order Summary</h2>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <i className={`fas ${item.icon || 'fa-box'} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-dark-brown mb-1">{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <div className="h-0.5 w-12 bg-gradient-to-r from-primary-orange to-transparent my-1"></div>
                          <p className="text-xs text-gray-600">
                            <i className="fas fa-truck text-primary-orange mr-1"></i>
                            Delivery: ₹100.00
                          </p>
                          <p className="text-sm font-bold text-primary-orange mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
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
                        <p className="text-green-700 text-xs font-semibold flex items-center gap-2">
                          <i className="fas fa-check-circle"></i>
                          Free Delivery!
                        </p>
                      </div>
                    )}
                    {subtotal < 1000 && subtotal > 0 && (
                      <div className="bg-orange-50 border border-primary-orange/30 rounded-lg p-3 -mt-2">
                        <p className="text-primary-orange text-xs font-semibold">
                          <i className="fas fa-info-circle mr-1"></i>
                          Add ₹{(1000 - subtotal).toFixed(2)} for FREE delivery!
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
                    <div className="h-0.5 w-full bg-gradient-to-r from-primary-orange via-hover-orange to-primary-orange mt-3 mb-3"></div>
                    <div className="flex justify-between text-xl font-bold text-dark-brown">
                      <span>Total</span>
                      <span className="text-primary-orange">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary-orange text-white px-6 py-4 rounded-full font-bold text-lg shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                        <i className="fas fa-check"></i>
                      </>
                    )}
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <i className="fas fa-lock text-green-600"></i>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <i className="fas fa-shield-alt text-green-600"></i>
                      <span>100% Payment Protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
