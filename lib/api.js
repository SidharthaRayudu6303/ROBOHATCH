/**
 * Central API Client - PRODUCTION READY
 * Handles all API requests with:
 * - Cookie-based authentication
 * - CSRF protection for state-changing requests
 * - 30s timeout with AbortController
 * - Centralized error handling
 * - Automatic 401 logout
 * - Sentry error monitoring for unexpected errors
 * 
 * ⚠️ ALL API calls MUST go through this file
 * ⚠️ ALL routes MUST come from ./apiRoutes.js
 */

import * as Sentry from '@sentry/nextjs'
import { ApiError, translateApiError } from './errorHandler'
import { getCsrfToken } from '../utils/security'
import { apiRateLimiter, authRateLimiter, paymentRateLimiter } from './rateLimiter'
import { 
  buildApiPath, 
  PRODUCT_ROUTES, 
  CART_ROUTES, 
  ORDER_ROUTES, 
  PAYMENT_ROUTES, 
  USER_ROUTES,
  AUTH_ROUTES
} from './apiRoutes'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://robohatch-backend-production.up.railway.app';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Make an authenticated API request with timeout and error handling
 * Automatically includes CSRF token for state-changing requests (POST/PUT/PATCH/DELETE)
 * @param {string} path - API path (e.g., '/api/v1/products')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  // 🔒 CRITICAL: Add CSRF token for state-changing requests
  const method = (options.method || 'GET').toUpperCase()
  const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
  
  // 🔒 RATE LIMITING: Check rate limits before making request
  try {
    const rateLimitKey = `${method}:${path}`
    
    // Apply stricter rate limits for sensitive endpoints
    if (path.includes('/auth/login') || path.includes('/auth/register')) {
      await authRateLimiter.checkLimit(rateLimitKey)
    } else if (path.includes('/payments/')) {
      await paymentRateLimiter.checkLimit(rateLimitKey)
    } else if (requiresCsrf) {
      // Apply general rate limit to all state-changing requests
      await apiRateLimiter.checkLimit(rateLimitKey)
    }
  } catch (rateLimitError) {
    clearTimeout(timeoutId)
    throw new ApiError(rateLimitError.message, 429, {
      action: 'wait',
      isRateLimitError: true
    })
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  
  // Add CSRF token to state-changing requests
  if (requiresCsrf) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken
    } else {
      console.warn('⚠️ CSRF token not found. Request may be rejected by backend.')
    }
  }

  try {
    const response = await fetch(`${API}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      credentials: 'include', // 🔥 REQUIRED for cookie-based auth
      headers,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses with standardized errors
    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Response not JSON
      }

      const translatedError = translateApiError(errorData, response.status);

      // Auto-logout on 401
      if (response.status === 401 && translatedError.action === 'logout') {
        window.dispatchEvent(new Event('authChanged'));
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }

      // ✅ Capture unexpected server errors (5xx) in Sentry
      // Expected errors (400, 401, 403, 404) are NOT sent to Sentry
      if (response.status >= 500) {
        Sentry.captureException(new Error(`API Error: ${response.status} ${path}`), {
          extra: {
            path,
            status: response.status,
            errorData,
            translatedMessage: translatedError.message,
          },
        })
      }

      throw new ApiError(translatedError.message, response.status, translatedError);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please check your connection and try again.', 504, {
        action: 'retry'
      });
    }

    // Re-throw ApiError as-is
    if (error.isApiError) {
      throw error;
    }

    // ✅ Capture unexpected network/unknown errors in Sentry
    Sentry.captureException(error, {
      extra: {
        path,
        type: 'network_or_unknown',
      },
    })

    // Network or unknown error
    throw new ApiError('Network error. Please check your internet connection.', 0, {
      action: 'retry',
      originalError: error
    });
  }
}

/**
 * GET request
 * @param {string} path - API path
 * @param {RequestInit} options - Additional options
 */
export async function apiGet(path, options = {}) {
  const response = await apiFetch(path, {
    ...options,
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * POST request
 * @param {string} path - API path
 * @param {Object} data - Request body
 * @param {RequestInit} options - Additional options
 */
export async function apiPost(path, data, options = {}) {
  const response = await apiFetch(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `POST ${path} failed`);
  }
  
  return response.json();
}

/**
 * PUT request
 * @param {string} path - API path
 * @param {Object} data - Request body
 * @param {RequestInit} options - Additional options
 */
export async function apiPut(path, data, options = {}) {
  const response = await apiFetch(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `PUT ${path} failed`);
  }
  
  return response.json();
}

/**
 * DELETE request
 * @param {string} path - API path
 * @param {RequestInit} options - Additional options
 */
export async function apiDelete(path, options = {}) {
  const response = await apiFetch(path, {
    ...options,
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`DELETE ${path} failed: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * PATCH request
 * @param {string} path - API path
 * @param {Object} data - Request body
 * @param {RequestInit} options - Additional options
 */
export async function apiPatch(path, data, options = {}) {
  const response = await apiFetch(path, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `PATCH ${path} failed`);
  }
  
  return response.json();
}

/**
 * Check authentication status
 * ✅ Returns user data if authenticated (httpOnly cookie valid)
 * ❌ Returns null if not authenticated (401)
 * @returns {Promise<Object|null>}
 */
export async function checkAuth() {
  try {
    const response = await apiFetch(buildApiPath(USER_ROUTES.ME), {
      method: 'GET',
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    // 401 or other error - not authenticated
    return null;
  } catch (error) {
    // Network error or other issue
    return null;
  }
}

/**
 * Get current user data
 * Alias for checkAuth for clearer intent
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  return checkAuth();
}

export default {
  fetch: apiFetch,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  patch: apiPatch,
};

/**
 * Get products from backend (with S3 URLs generated)
 * Backend generates imageUrl from S3 bucket
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>}
 */
export async function getProducts(category = null) {
  try {
    const path = category 
      ? `${buildApiPath(PRODUCT_ROUTES.LIST)}?category=${category}` 
      : buildApiPath(PRODUCT_ROUTES.LIST);
    return await apiGet(path);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

/**
 * Get single product by ID from backend (with S3 URL)
 * @param {string} productId - Product ID
 * @returns {Promise<Object>}
 */
export async function getProduct(productId) {
  try {
    return await apiGet(buildApiPath(PRODUCT_ROUTES.GET(productId)));
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    throw error;
  }
}

/**
 * CART API FUNCTIONS
 * All cart operations go through backend
 * Backend calculates all prices and totals
 */

/**
 * Get user's cart with calculated totals from backend
 * @returns {Promise<Object>} Cart with items, subtotal, shipping, tax, total
 */
export async function getCart() {
  try {
    return await apiGet(buildApiPath(CART_ROUTES.GET));
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
}

/**
 * Add item to cart
 * @param {Object} item - Item to add { productId, quantity }
 * @returns {Promise<Object>} Updated cart with totals
 */
export async function addToCart(item) {
  try {
    return await apiPost(buildApiPath(CART_ROUTES.ADD_ITEM), item);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {Object} updates - Updates { quantity }
 * @returns {Promise<Object>} Updated cart with totals
 */
export async function updateCartItem(itemId, updates) {
  try {
    return await apiPut(buildApiPath(CART_ROUTES.UPDATE_ITEM(itemId)), updates);
  } catch (error) {
    console.error('Failed to update cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise<Object>} Updated cart with totals
 */
export async function removeFromCart(itemId) {
  try {
    return await apiDelete(buildApiPath(CART_ROUTES.DELETE_ITEM(itemId)));
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  }
}

/**
 * CHECKOUT & ORDERS API FUNCTIONS
 */

/**
 * Generate UUID v4 for idempotency key
 * @returns {string} UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create order (checkout)
 * Uses idempotency key to prevent duplicate orders
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Order with orderId
 */
export async function createOrder(orderData) {
  try {
    // Generate idempotency key for this order
    const idempotencyKey = generateUUID();
    
    const response = await apiFetch(buildApiPath(ORDER_ROUTES.CREATE), {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Checkout failed' }));
      throw new Error(error.message || error.error || 'Failed to create order');
    }

    // Backend creates order, clears cart, returns orderId
    return await response.json();
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export async function getOrder(orderId) {
  try {
    return await apiGet(buildApiPath(ORDER_ROUTES.GET(orderId)));
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Get user's orders
 * @returns {Promise<Array>} List of orders
 */
export async function getOrders() {
  try {
    return await apiGet(buildApiPath(ORDER_ROUTES.LIST));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

/**
 * Initiate payment for an order
 * POST /api/v1/payments/initiate
 * 
 * Backend creates Razorpay payment link and returns URL
 * Frontend redirects user to payment URL
 * 
 * @param {string} orderId - Order ID to pay for
 * @returns {Promise<{paymentUrl: string, paymentId: string}>}
 */
export async function initiatePayment(orderId) {
  try {
    const response = await apiFetch(buildApiPath(PAYMENT_ROUTES.INITIATE), {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment initiation failed' }));
      throw new Error(error.message || error.error || 'Failed to initiate payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to initiate payment:', error);
    throw error;
  }
}

/**
 * Get payment status for an order
 * GET /api/v1/payments/:orderId
 * 
 * @param {string} orderId - Order ID
 * @returns {Promise<{status: string, paymentId?: string, amount?: number, paidAt?: string}>}
 */
export async function getPaymentStatus(orderId) {
  try {
    return await apiGet(buildApiPath(PAYMENT_ROUTES.GET_STATUS(orderId)));
  } catch (error) {
    console.error(`Failed to fetch payment status for ${orderId}:`, error);
    throw error;
  }
}

// ============================================
// CUSTOM UPLOAD FUNCTIONS
// ============================================

/**
 * Upload custom file for printing
 * POST /api/v1/custom-files/upload
 * 
 * Backend sends email with file attachment and stores metadata
 * No S3 usage - files sent directly via email
 * 
 * @param {FormData} formData - Form data with file and customer details
 * @returns {Promise<{uploadId: string, message: string}>}
 */
export async function uploadCustomFile(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/custom-files/upload`, {
      method: 'POST',
      credentials: 'include',
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || error.error || 'Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to upload custom file:', error);
    throw error;
  }
}

/**
 * Get custom upload history for current user
 * GET /api/v1/custom-files/uploads
 * 
 * @returns {Promise<Array>} List of custom uploads
 */
export async function getCustomUploads() {
  try {
    return await apiGet('/api/v1/custom-files/uploads');
  } catch (error) {
    console.error('Failed to fetch custom uploads:', error);
    throw error;
  }
}

