'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { apiGet, apiPost } from '../lib/api'
import { ORDER_ROUTES, PAYMENT_ROUTES, buildApiPath } from '../lib/apiRoutes'

export default function Payment() {
  const router = useRouter()
  const { orderId } = router.query
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, orderId])

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await apiGet(buildApiPath(ORDER_ROUTES.GET(orderId)))
      setOrderDetails(data)
    } catch (err) {
      setError(err.message || 'Failed to load order details')
    } finally {
      setIsLoading(false)
    }
  }

  const initiatePayment = async () => {
    try {
      setError(null)

      // Check if Razorpay SDK is loaded
      if (!razorpayLoaded || typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.')
      }

      const paymentData = await apiPost(buildApiPath(PAYMENT_ROUTES.INITIATE), { orderId })

      const options = {
        key: paymentData.key_id, // ✅ Razorpay PUBLIC key (safe to expose)
        amount: paymentData.amount, // ✅ Amount from backend
        currency: paymentData.currency,
        name: 'ROBOHATCH',
        description: `Order #${orderId}`,
        order_id: paymentData.razorpay_order_id, // ✅ Backend-created order ID
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F25C05',
        },
        handler: function (response) {
          handlePaymentSuccess(response)
        },
        modal: {
          ondismiss: function () {
            setError('Payment window was closed. Please try again.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        handlePaymentFailure(response)
      })
      razorpay.open()
    } catch (err) {
      setError(err.message || 'Failed to initiate payment')
    }
  }

  const handlePaymentSuccess = (response) => {
    setPaymentStatus('success')
  }

  const handlePaymentFailure = (response) => {
    setPaymentStatus('failed')
    setError('Payment failed. Please try again.')
  }

  if (authLoading || isLoading) {
    return (
      <>
        <Head>
          <title>Payment - ROBOHATCH</title>
        </Head>
        {/* 🔒 SECURITY: Load Razorpay SDK with Next.js Script component */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          onLoad={() => setRazorpayLoaded(true)}
          onError={() => console.error('❌ Failed to load Razorpay SDK')}
        />
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-orange mb-4"></div>
            <p className="text-gray-600 text-lg">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!orderId) {
    return (
      <>
        <Head>
          <title>Payment - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto px-4">
            <i className="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Order Found</h2>
            <p className="text-gray-600 mb-6">Please complete checkout first.</p>
            <button
              onClick={() => router.push('/cart')}
              className="bg-primary-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-hover-orange transition-all"
            >
              Go to Cart
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <>
        <Head>
          <title>Payment Success - ROBOHATCH</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <i className="fas fa-check-circle text-green-600 text-5xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
              <p className="text-gray-600 mb-2">Thank you for your purchase</p>
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-1">Order ID</p>
                <p className="text-xl font-bold text-primary-orange">#{orderId}</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Your order is being processed. You will receive a confirmation email shortly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full bg-primary-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-hover-orange transition-all shadow-lg"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-primary-orange hover:text-primary-orange transition-all"
                >
                  Continue Shopping
                </button>
              </div>
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
        <title>Payment - ROBOHATCH</title>
      </Head>
      
      {/* 🔒 SECURITY: Load Razorpay SDK with Next.js Script component */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => console.error('❌ Failed to load Razorpay SDK')}
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-brown mb-2">Complete Payment</h1>
            <p className="text-gray-600">Order #{orderId}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {orderDetails && (
              <>
                <div className="bg-gradient-to-r from-primary-orange to-hover-orange p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
                  <p className="text-orange-100">Review your order before payment</p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    {orderDetails.items?.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <i className={`fas ${item.icon || 'fa-box'} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary-orange mt-1">
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

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{orderDetails.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">₹{orderDetails.shipping?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span className="font-semibold">₹{orderDetails.tax?.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between text-2xl font-bold text-dark-brown">
                      <span>Total</span>
                      <span className="text-primary-orange">₹{orderDetails.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={initiatePayment}
                    className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white px-6 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-lock"></i>
                    Pay ₹{orderDetails.totalAmount?.toFixed(2)}
                  </button>

                  {paymentStatus === 'failed' && (
                    <button
                      onClick={initiatePayment}
                      className="w-full mt-4 bg-white border-2 border-primary-orange text-primary-orange px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all"
                    >
                      <i className="fas fa-redo mr-2"></i>
                      Retry Payment
                    </button>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-shield-alt text-green-600"></i>
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-lock text-green-600"></i>
                        <span>SSL Encrypted</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Powered by Razorpay
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
