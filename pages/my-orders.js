'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { apiGet } from '../lib/api'
import { ORDER_ROUTES, buildApiPath } from '../lib/apiRoutes'

export default function MyOrders() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await apiGet(buildApiPath(ORDER_ROUTES.LIST))
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleReviewSubmit = async () => {
    // ❌ DEFERRED TO v1.1.0+
    // Reviews are not available in v1.0.0 backend
    alert('Product reviews will be available in the next update. Thank you for your patience!')
    setShowReviewModal(false)
    return

    /* ORIGINAL CODE - TO BE RE-ENABLED IN v1.1.0
    if (!reviewData.comment.trim()) {
      alert('Please write a review comment')
      return
    }

    try {
      // Submit review to backend - POST /reviews
      const reviewPayload = {
        orderId: selectedOrder.id,
        productId: reviewProduct.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      }
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      alert('Review submitted successfully!')
      // Reset form and close modal
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
      setReviewProduct(null)
    } catch (err) {
      alert('Failed to submit review: ' + err.message)
    }
  }

  if (authLoading || isLoading) {
    return (
      <>
        <Head>
          <title>My Orders - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-orange mb-4"></div>
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>My Orders - ROBOHATCH</title>
        <meta name="description" content="View your order history at ROBOHATCH" />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-brown mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order.orderId}
                  href={`/order/${order.orderId}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-dark-brown">
                            Order #{order.orderId}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-calendar mr-2 text-primary-orange"></i>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary-orange">
                          ₹{order.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                        </p>
                        <div className="flex items-center gap-2 text-primary-orange font-semibold">
                          <span className="text-sm">View Details</span>
                          <i className="fas fa-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-bag text-6xl text-primary-orange/50"></i>
              </div>
              <h2 className="text-2xl font-bold text-dark-brown mb-3">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here
              </p>
              <Link
                href="/"
                className="inline-block bg-primary-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-hover-orange transition-all shadow-lg"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
