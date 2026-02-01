/**
 * Cart Component Example - Backend-Driven Commerce
 * 
 * KEY PRINCIPLES:
 * ✅ NO price calculations on frontend
 * ✅ Backend returns ALL totals
 * ✅ Use API for all cart operations
 */

import { useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '@/lib/api';

export default function CartExample() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      // ✅ GET /api/v1/cart
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (productId, quantity = 1) => {
    try {
      // ✅ POST /api/v1/cart/items
      await addToCart({ productId, quantity });
      await loadCart(); // Reload to get updated totals from backend
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // ✅ PUT /api/v1/cart/items/:id
      await updateCartItem(itemId, { quantity: newQuantity });
      await loadCart(); // Reload to get recalculated totals
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // ✅ DELETE /api/v1/cart/items/:id
      await removeFromCart(itemId);
      await loadCart(); // Reload to get recalculated totals
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-orange"></i>
      </div>
    );
  }

  // ❌ WRONG: const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // ✅ CORRECT: Get totals from backend
  const items = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const shipping = cartData?.shipping || 0;
  const tax = cartData?.tax || 0;
  const total = cartData?.total || 0;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-2xl">
                      <i className="fas fa-box"></i>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary-orange hover:text-white transition-all disabled:opacity-50"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <span className="font-bold text-lg min-w-[30px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary-orange hover:text-white transition-all"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      <i className="fas fa-trash mr-1"></i> Remove
                    </button>
                  </div>
                </div>

                {/* Price - FROM BACKEND */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-orange">
                    ₹{item.itemTotal?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price?.toFixed(2)} each
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - ALL VALUES FROM BACKEND */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {/* ✅ Subtotal from backend */}
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {/* ✅ Shipping from backend */}
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {/* ✅ Tax from backend */}
              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                {/* ✅ Total from backend */}
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-orange">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary-orange to-hover-orange text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all">
              Proceed to Checkout
            </button>

            {/* Savings/Promo Info from Backend */}
            {cartData?.savings > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                <p className="text-green-700 font-semibold">
                  <i className="fas fa-tag mr-2"></i>
                  You saved ₹{cartData.savings.toFixed(2)}!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * BACKEND RESPONSE EXAMPLE:
 * 
 * GET /api/v1/cart
 * {
 *   "items": [
 *     {
 *       "id": "cart_item_123",
 *       "productId": "prod_1",
 *       "name": "Krishna Idol",
 *       "description": "Lord Krishna with flute",
 *       "imageUrl": "https://bucket.s3.region.amazonaws.com/idols/krishna.jpg",
 *       "price": 799,
 *       "quantity": 2,
 *       "itemTotal": 1598  // ✅ Calculated by backend
 *     }
 *   ],
 *   "subtotal": 1598,     // ✅ Backend calculates
 *   "shipping": 0,        // ✅ Backend determines (free over 1000)
 *   "tax": 127.84,        // ✅ Backend calculates (8%)
 *   "total": 1725.84,     // ✅ Backend calculates final total
 *   "savings": 100        // ✅ Backend calculates savings (optional)
 * }
 * 
 * ✅ Frontend NEVER calculates prices
 * ✅ Backend owns ALL pricing logic
 * ✅ Frontend only displays what backend sends
 */
