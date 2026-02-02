'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ShipmentTracking from '../../components/ShipmentTracking'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../lib/api'
import { ORDER_ROUTES, buildApiPath } from '../../lib/apiRoutes'

export default function OrderDetails() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && id) {
      loadOrderDetails()
    }
  }, [isAuthenticated, id])

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await apiGet(buildApiPath(ORDER_ROUTES.GET(id)))
      setOrder(data)
    } catch (err) {
      setError(err.message || 'Failed to load order details')
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (authLoading || isLoading) {
    return (
      <>
        <Head>
          <title>Order Details - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-orange mb-4"></div>
            <p className="text-gray-600 text-lg">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Head>
          <title>Order Not Found - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto px-4">
            <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/my-orders"
              className="inline-block bg-primary-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-hover-orange transition-all"
            >
              View All Orders
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Order #{order.orderId} - ROBOHATCH</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/my-orders"
              className="inline-flex items-center gap-2 text-primary-orange hover:text-hover-orange font-semibold mb-4"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Orders
            </Link>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-dark-brown mb-2">
                  Order #{order.orderId}
                </h1>
                <p className="text-gray-600">
                  <i className="fas fa-calendar mr-2"></i>
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border self-start ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-dark-brown mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <i className={`fas ${item.icon || 'fa-box'} text-2xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-orange">
                          {/* 🔒 SECURITY: Never calculate prices on client */}
                          {item.lineTotal !== undefined 
                            ? `₹${item.lineTotal.toFixed(2)}`
                            : '₹—.—' /* Backend must provide lineTotal */
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.statusTimeline && order.statusTimeline.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-dark-brown mb-4">Order Timeline</h2>
                  <div className="space-y-4">
                    {order.statusTimeline.map((timeline, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-primary-orange text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            <i className={`fas ${
                              timeline.status === 'delivered' ? 'fa-check-circle' :
                              timeline.status === 'shipped' ? 'fa-truck' :
                              timeline.status === 'processing' ? 'fa-cog' :
                              timeline.status === 'confirmed' ? 'fa-check' :
                              timeline.status === 'cancelled' ? 'fa-times' :
                              'fa-clock'
                            }`}></i>
                          </div>
                          {index < order.statusTimeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h3 className="font-semibold text-gray-900 capitalize">{timeline.status}</h3>
                          <p className="text-sm text-gray-600">{formatDate(timeline.timestamp)}</p>
                          {timeline.description && (
                            <p className="text-sm text-gray-500 mt-1">{timeline.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ShipmentTracking orderId={id} />

              {order.shippingAddress && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-dark-brown mb-4">
                    <i className="fas fa-map-marker-alt text-primary-orange mr-2"></i>
                    Shipping Address
                  </h2>
                  <div className="text-gray-700">
                    <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2">
                      <i className="fas fa-phone mr-2 text-primary-orange"></i>
                      {order.shippingAddress.phone}
                    </p>
                    <p>
                      <i className="fas fa-envelope mr-2 text-primary-orange"></i>
                      {order.shippingAddress.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-dark-brown mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {order.shipping === 0 ? 'FREE' : `₹${order.shipping?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">₹{order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-xl font-bold text-dark-brown">
                    <span>Total</span>
                    <span className="text-primary-orange">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {order.paymentMethod && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Method</h3>
                    <p className="text-gray-600 capitalize">{order.paymentMethod}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button className="w-full bg-primary-orange text-white py-3 rounded-lg font-semibold hover:bg-hover-orange transition-all shadow-lg">
                    <i className="fas fa-file-invoice mr-2"></i>
                    Download Invoice
                  </button>
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary-orange hover:text-primary-orange transition-all"
                  >
                    <i className="fas fa-headset mr-2"></i>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
