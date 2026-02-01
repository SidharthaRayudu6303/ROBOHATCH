/**
 * Checkout Example - Idempotent Order Creation
 * 
 * KEY PRINCIPLES:
 * ✅ POST /api/v1/orders with Idempotency-Key header
 * ✅ Backend creates order, clears cart, returns orderId
 * ✅ Prevents duplicate orders with same idempotency key
 */

import { useState } from 'react';
import { createOrder, initiatePayment } from '@/lib/api';

export default function CheckoutExample() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

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
        },
        paymentMethod: formData.paymentMethod,
      };

      /**
       * STEP 1: Create Order
       * ✅ POST /api/v1/orders
       * Headers: { 'Idempotency-Key': uuid() }
       * 
       * Backend will:
       * 1. Create order
       * 2. Clear user's cart
       * 3. Return orderId
       */
      const result = await createOrder(orderData);
      
      // Trigger cart update event (cart is now empty)
      window.dispatchEvent(new Event('cartUpdated'));
      
      /**
       * STEP 2: Initiate Payment
       * ✅ POST /api/v1/payments/initiate
       * Body: { orderId }
       * 
       * Backend will:
       * 1. Create Razorpay payment link
       * 2. Return payment URL
       */
      const paymentResult = await initiatePayment(result.orderId);
      
      /**
       * STEP 3: Redirect to Payment
       * User completes payment on Razorpay
       * Webhook updates backend
       */
      window.location.href = paymentResult.paymentUrl;
      
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.message || 'Failed to complete checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success Screen
  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-dark-brown mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order ID: <span className="font-bold text-primary-orange">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            We've sent a confirmation email with order details.
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

  // Checkout Form
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-5 h-5"
              />
              <i className="fas fa-credit-card text-xl text-primary-orange"></i>
              <span className="font-medium">Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-5 h-5"
              />
              <i className="fas fa-money-bill-wave text-xl text-primary-orange"></i>
              <span className="font-medium">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i>
              Processing Order...
            </span>
          ) : (
            <span>Place Order</span>
          )}
        </button>
      </form>
    </div>
  );
}

/**
 * API REQUEST EXAMPLE:
 * 
 * POST /api/v1/orders
 * Headers: {
 *   "Content-Type": "application/json",
 *   "Idempotency-Key": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * }
 * Body: {
 *   "shippingAddress": {
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john@example.com",
 *     "phone": "9876543210",
 *     "address": "123 Main St",
 *     "city": "Mumbai",
 *     "state": "Maharashtra",
 *     "zipCode": "400001"
 *   },
 *   "paymentMethod": "card"
 * }
 * 
 * BACKEND RESPONSE:
 * {
 *   "orderId": "ORD-2026-001234",
 *   "status": "pending",
 *   "total": 1725.84,
 *   "createdAt": "2026-02-01T10:30:00Z"
 * }
 * 
 * ✅ Backend creates order
 * ✅ Backend clears cart
 * ✅ Backend returns orderId
 * ✅ Idempotency-Key prevents duplicate orders
 */
