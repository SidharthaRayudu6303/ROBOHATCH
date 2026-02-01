'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { apiGet } from '../lib/api'

export default function CancelledOrders() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [cancelledOrders, setCancelledOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadCancelledOrders()
  }, [isAuthenticated, router])

  const loadCancelledOrders = async () => {
    try {
      // Load orders from backend and filter cancelled
      const response = await apiGet('/orders?status=cancelled')
      const cancelled = response.orders || []
      // Sort by date, newest first
      const sortedOrders = cancelled.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCancelledOrders(sortedOrders)
    } catch (error) {
      console.error('Failed to load cancelled orders:', error)
      setCancelledOrders([])
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-orange"></i>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Cancelled Orders - ROBOHATCH</title>
        <meta name="description" content="View your cancelled orders at ROBOHATCH" />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-8 sm:py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown mb-2 sm:mb-3">
                  Cancelled Orders
                </h1>
                <p className="text-sm sm:text-base text-gray-600">View all your cancelled orders</p>
              </div>
              <button
                onClick={() => router.push('/my-orders')}
                className="bg-gradient-to-r from-primary-orange to-hover-orange text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to All Orders
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-red-500 text-xl mt-0.5"></i>
              <div>
                <h3 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">About Cancelled Orders</h3>
                <p className="text-xs sm:text-sm text-red-800">
                  These orders have been cancelled. Refunds will be processed within 5-7 business days. 
                  For any queries, please contact our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Cancelled Orders List */}
          {cancelledOrders.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {cancelledOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-red-100"
                >
                  <div className="p-5 sm:p-6 md:p-8">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-dark-brown">Order #{order.id}</h3>
                          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                            Cancelled
                          </span>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-2 rounded">
                          <p className="text-xs sm:text-sm text-red-800 font-medium">
                            <i className="fas fa-times-circle mr-2"></i>
                            Order cancelled on {order.date}
                          </p>
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <p><i className="fas fa-calendar mr-2 text-primary-orange"></i>Original Order Date: {order.date}</p>
                          <p><i className="fas fa-credit-card mr-2 text-primary-orange"></i>Payment: {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-400 line-through">₹{order.total}</p>
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          <i className="fas fa-undo mr-1"></i>
                          Refund Initiated
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg opacity-75">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg grayscale"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-dark-brown text-sm sm:text-base truncate">{item.name}</h5>
                              <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-400 text-sm sm:text-base line-through">₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-gray-500"></i>
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-700">
                        {order.customer}<br />
                        {order.address}, {order.city}<br />
                        {order.state} - {order.zipCode}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4 space-y-2 opacity-75">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span className="line-through">₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="line-through">{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span className="line-through">₹{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base sm:text-lg font-bold text-gray-500 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="line-through">₹{order.total}</span>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg mt-3">
                        <p className="text-sm text-red-700 font-semibold text-center">
                          <i className="fas fa-check-circle mr-2"></i>
                          Refund of ₹{order.total} will be processed within 5-7 business days
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button 
                        className="flex-1 bg-gradient-to-r from-primary-orange to-hover-orange text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition-all active:scale-95"
                        onClick={() => router.push('/contact')}
                      >
                        <i className="fas fa-headset mr-2"></i>
                        Contact Support
                      </button>
                      <button 
                        className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-sm sm:text-base hover:border-primary-orange hover:text-primary-orange transition-all active:scale-95"
                        onClick={() => router.push('/#products')}
                      >
                        <i className="fas fa-shopping-bag mr-2"></i>
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check-circle text-5xl sm:text-6xl text-green-500/50"></i>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-3">No Cancelled Orders</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You haven't cancelled any orders. All your orders are active!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/my-orders')}
                  className="bg-gradient-to-r from-primary-orange to-hover-orange text-white px-8 py-3 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fas fa-box mr-2"></i>
                  View All Orders
                </button>
                <button
                  onClick={() => router.push('/#products')}
                  className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold text-sm sm:text-base hover:border-primary-orange hover:text-primary-orange transition-all active:scale-95"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Start Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
