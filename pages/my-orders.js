'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getAuthToken } from '../utils/api'

export default function MyOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewProduct, setReviewProduct] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)

  useEffect(() => {
    // Check authentication
    const token = getAuthToken()
    if (!token) {
      router.push('/login')
      return
    }

    loadOrders()
  }, [router])

  const loadOrders = () => {
    // Load order history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]')
    // Sort by date, newest first
    const sortedOrders = orderHistory.sort((a, b) => b.id - a.id)
    setOrders(sortedOrders)
    setIsLoading(false)
  }

  const canCancelOrder = (order) => {
    // Check if order can be cancelled (within 1-2 days and not already cancelled/delivered)
    if (order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'delivered') {
      return false
    }
    const orderDate = new Date(order.id) // Using order ID as timestamp
    const currentDate = new Date()
    const hoursDiff = (currentDate - orderDate) / (1000 * 60 * 60)
    return hoursDiff <= 48 // 48 hours = 2 days
  }

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId)
    setShowCancelModal(true)
  }

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]')
      const updatedOrders = orderHistory.map(order => 
        order.id === orderToCancel ? { ...order, status: 'Cancelled' } : order
      )
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders))
      
      // Also update in orders
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedAllOrders = allOrders.map(order => 
        order.id === orderToCancel ? { ...order, status: 'Cancelled' } : order
      )
      localStorage.setItem('orders', JSON.stringify(updatedAllOrders))
      
      loadOrders()
      setShowCancelModal(false)
      setOrderToCancel(null)
    }
  }

  const handleReviewSubmit = () => {
    if (!reviewData.comment.trim()) {
      alert('Please write a review comment')
      return
    }

    const review = {
      id: Date.now(),
      orderId: selectedOrder.id,
      productId: reviewProduct.id,
      productName: reviewProduct.name,
      productImage: reviewProduct.image,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      customerName: selectedOrder.customer,
      customerEmail: selectedOrder.email
    }

    // Save review
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    reviews.push(review)
    localStorage.setItem('reviews', JSON.stringify(reviews))

    // Mark product as reviewed in order
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]')
    const updatedOrders = orderHistory.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          items: order.items.map(item => 
            item.id === reviewProduct.id ? { ...item, reviewed: true } : item
          )
        }
      }
      return order
    })
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders))

    loadOrders()
    setShowReviewModal(false)
    setReviewData({ rating: 5, comment: '' })
    setReviewProduct(null)
    alert('Thank you for your review!')
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
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
        <title>My Orders - ROBOHATCH</title>
        <meta name="description" content="View your order history at ROBOHATCH" />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-8 sm:py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown mb-2 sm:mb-3">
                  My Orders
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Track and manage your orders</p>
              </div>
              {orders.filter(order => order.status.toLowerCase() === 'cancelled').length > 0 && (
                <button
                  onClick={() => router.push('/cancelled-orders')}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <i className="fas fa-times-circle"></i>
                  Cancelled Orders ({orders.filter(order => order.status.toLowerCase() === 'cancelled').length})
                </button>
              )}
            </div>
          </div>

          {/* Cancellation Policy Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-500 text-xl mt-0.5"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Cancellation Policy</h3>
                <p className="text-xs sm:text-sm text-blue-800">
                  Orders can be cancelled within <strong>48 hours (2 days)</strong> of placing the order. 
                  After this period, cancellation will not be available. Please contact support for any queries.
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.filter(order => order.status.toLowerCase() !== 'cancelled').length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {orders.filter(order => order.status.toLowerCase() !== 'cancelled').map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-5 sm:p-6 md:p-8">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-dark-brown">Order #{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.status.toLowerCase() === 'cancelled' && (
                          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-2 rounded">
                            <p className="text-xs sm:text-sm text-red-800 font-medium">
                              <i className="fas fa-info-circle mr-2"></i>
                              This order has been cancelled. If you have any questions, please contact support.
                            </p>
                          </div>
                        )}
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <p><i className="fas fa-calendar mr-2 text-primary-orange"></i>{order.date}</p>
                          <p><i className="fas fa-credit-card mr-2 text-primary-orange"></i>Payment: {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${order.status.toLowerCase() === 'cancelled' ? 'text-gray-400 line-through' : 'text-primary-orange'}`}>₹{order.total}</p>
                        {order.status.toLowerCase() === 'cancelled' && (
                          <p className="text-xs text-red-600 font-semibold mt-1">Refund Initiated</p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-dark-brown text-sm sm:text-base truncate">{item.name}</h5>
                              <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <p className="font-bold text-primary-orange text-sm sm:text-base">₹{item.price}</p>
                              {order.status.toLowerCase() === 'delivered' && !item.reviewed && (
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setReviewProduct(item)
                                    setShowReviewModal(true)
                                  }}
                                  className="bg-primary-orange text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-hover-orange transition-colors whitespace-nowrap"
                                  title="Write a review"
                                >
                                  <i className="fas fa-star mr-1"></i>
                                  Review
                                </button>
                              )}
                              {item.reviewed && (
                                <span className="text-green-600 text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                                  <i className="fas fa-check-circle"></i>
                                  Reviewed
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-4 sm:mb-6 p-4 bg-orange-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-primary-orange"></i>
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-700">
                        {order.customer}<br />
                        {order.address}, {order.city}<br />
                        {order.state} - {order.zipCode}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span>₹{order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base sm:text-lg font-bold text-dark-brown pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-primary-orange">₹{order.total}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      {canCancelOrder(order) && (
                        <button 
                          className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-600 hover:shadow-lg transition-all active:scale-95"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <i className="fas fa-times-circle mr-2"></i>
                          Cancel Order
                        </button>
                      )}
                      <button 
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-600 hover:shadow-lg transition-all active:scale-95"
                      >
                        <i className="fas fa-file-invoice mr-2"></i>
                        Invoice
                      </button>
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
                        <i className="fas fa-redo mr-2"></i>
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-bag text-5xl sm:text-6xl text-primary-orange/50"></i>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark-brown mb-3">No Active Orders</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {orders.filter(order => order.status.toLowerCase() === 'cancelled').length > 0 
                  ? 'All your orders have been cancelled. View them in Cancelled Orders section.'
                  : 'Start shopping to see your orders here'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {orders.filter(order => order.status.toLowerCase() === 'cancelled').length > 0 && (
                  <button
                    onClick={() => router.push('/cancelled-orders')}
                    className="bg-red-100 text-red-700 px-8 py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-red-200 transition-all active:scale-95"
                  >
                    <i className="fas fa-times-circle mr-2"></i>
                    View Cancelled Orders
                  </button>
                )}
                <button
                  onClick={() => router.push('/#products')}
                  className="bg-gradient-to-r from-primary-orange to-hover-orange text-white px-8 py-3 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Start Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-dark-brown mb-2">Write a Review</h2>
                  <p className="text-sm text-gray-600">Share your experience with this product</p>
                </div>
                <button
                  onClick={() => {
                    setShowReviewModal(false)
                    setReviewData({ rating: 5, comment: '' })
                    setReviewProduct(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-2xl"></i>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <img 
                  src={reviewProduct.image} 
                  alt={reviewProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-dark-brown">{reviewProduct.name}</h3>
                  <p className="text-sm text-gray-600">Order #{selectedOrder.id}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <i 
                        className={`fas fa-star text-3xl ${
                          star <= reviewData.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      ></i>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reviewData.rating === 1 && 'Poor'}
                  {reviewData.rating === 2 && 'Fair'}
                  {reviewData.rating === 3 && 'Good'}
                  {reviewData.rating === 4 && 'Very Good'}
                  {reviewData.rating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Tell us about your experience with this product..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewData.comment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false)
                    setReviewData({ rating: 5, comment: '' })
                    setReviewProduct(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="flex-1 bg-gradient-to-r from-primary-orange to-hover-orange text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="p-6 sm:p-8">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-3xl text-red-600"></i>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-dark-brown text-center mb-3">
                Cancel Order?
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to cancel this order? This action cannot be undone. 
                A refund will be initiated and processed within 5-7 business days.
              </p>

              {/* Order Info */}
              {orderToCancel && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">Order #</span>
                    <span className="text-primary-orange font-bold">{orderToCancel}</span>
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setOrderToCancel(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fas fa-times-circle mr-2"></i>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
