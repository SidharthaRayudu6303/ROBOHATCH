/**
 * Payment Example - Razorpay Payment Link Integration
 * 
 * FLOW:
 * 1. User creates order → POST /api/v1/orders
 * 2. Frontend initiates payment → POST /api/v1/payments/initiate
 * 3. Backend creates Razorpay payment link
 * 4. Frontend redirects to payment URL
 * 5. User completes payment on Razorpay
 * 6. Razorpay webhook → Backend updates order status
 * 7. User redirected back to success page
 */

import { useState, useEffect } from 'react';
import { initiatePayment, getPaymentStatus } from '@/lib/api';

export default function PaymentExample({ orderId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Check payment status on component mount
   * (for when user returns from Razorpay)
   */
  useEffect(() => {
    if (orderId) {
      checkPaymentStatus();
    }
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      const status = await getPaymentStatus(orderId);
      setPaymentStatus(status);
    } catch (err) {
      console.error('Failed to check payment status:', err);
    }
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      /**
       * POST /api/v1/payments/initiate
       * Body: { orderId: "ORD-2026-001234" }
       * 
       * Backend Response:
       * {
       *   "paymentUrl": "https://razorpay.me/@sivaramakrishnarankiredd?amount=172584&purpose=Order-ORD-2026-001234",
       *   "paymentId": "pay_abc123xyz"
       * }
       */
      const result = await initiatePayment(orderId);
      
      /**
       * ✅ Redirect to Razorpay payment page
       * User completes payment
       * Razorpay webhook → Backend updates order status
       */
      window.location.href = result.paymentUrl;
      
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  // Payment Success State
  if (paymentStatus?.status === 'completed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-dark-brown mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-2">
            Order ID: <span className="font-bold text-primary-orange">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            Payment ID: <span className="font-mono text-sm">{paymentStatus.paymentId}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href={`/orders/${orderId}`}
              className="bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-hover-orange transition-all"
            >
              View Order Details
            </a>
            <a 
              href="/"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Payment Pending State
  if (paymentStatus?.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <i className="fas fa-clock text-6xl text-yellow-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-dark-brown mb-4">
            Payment Pending
          </h1>
          <p className="text-gray-600 mb-2">
            Order ID: <span className="font-bold text-primary-orange">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            Your payment is being processed. This may take a few minutes.
          </p>
          <button
            onClick={checkPaymentStatus}
            className="bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-hover-orange transition-all"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Check Status
          </button>
        </div>
      </div>
    );
  }

  // Payment Failed State
  if (paymentStatus?.status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <i className="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-dark-brown mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-8">
            Unfortunately, your payment could not be processed. Please try again.
          </p>
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-hover-orange transition-all disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Retry Payment'}
          </button>
        </div>
      </div>
    );
  }

  // Initial Payment Screen
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-dark-brown mb-6">
          Complete Your Payment
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-bold text-primary-orange">{orderId}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Payment Status:</span>
            <span className="font-semibold text-yellow-600">
              <i className="fas fa-clock mr-1"></i>
              Awaiting Payment
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <i className="fas fa-info-circle text-blue-500 mr-2"></i>
          <span className="text-sm text-blue-800">
            You will be redirected to Razorpay to complete your payment securely.
          </span>
        </div>

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i>
              Redirecting to Payment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-lock"></i>
              Pay Now
            </span>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <i className="fas fa-shield-alt mr-1"></i>
          Secured by Razorpay
        </p>
      </div>
    </div>
  );
}

/**
 * BACKEND API ENDPOINTS REQUIRED:
 * 
 * 1. POST /api/v1/payments/initiate
 *    Request: { "orderId": "ORD-2026-001234" }
 *    Response: {
 *      "paymentUrl": "https://razorpay.me/@sivaramakrishnarankiredd?amount=172584&purpose=Order-ORD-2026-001234",
 *      "paymentId": "pay_abc123xyz"
 *    }
 * 
 * 2. GET /api/v1/payments/:orderId
 *    Response: {
 *      "status": "pending" | "completed" | "failed",
 *      "paymentId": "pay_abc123xyz",
 *      "amount": 1725.84,
 *      "paidAt": "2026-02-01T11:15:00Z"
 *    }
 * 
 * 3. POST /api/v1/payments/webhook (Razorpay webhook)
 *    Razorpay sends payment status updates
 *    Backend updates order.paymentStatus
 */

/**
 * RAZORPAY PAYMENT LINK FORMAT:
 * 
 * Base URL: https://razorpay.me/@sivaramakrishnarankiredd
 * Query Parameters:
 *   - amount: Amount in paise (e.g., 172584 for ₹1725.84)
 *   - purpose: Description (e.g., "Order-ORD-2026-001234")
 * 
 * Example:
 * https://razorpay.me/@sivaramakrishnarankiredd?amount=172584&purpose=Order-ORD-2026-001234
 * 
 * After payment:
 * - User redirected back to your site
 * - Razorpay webhook notifies your backend
 * - Backend updates order status
 */
