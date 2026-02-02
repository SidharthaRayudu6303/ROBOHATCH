/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROBOHATCH FRONTEND → BACKEND API CONTRACT v1.0.0 (REVENUE RELEASE)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ DO NOT BREAK THIS CONTRACT ⚠️
 * 
 * This file defines ALL backend endpoints available in v1.0.0.
 * Any endpoint NOT listed here is NOT implemented in backend.
 * 
 * RULES:
 * - NO hardcoded URLs in components
 * - ALL API calls MUST use these routes
 * - Dynamic routes are FUNCTIONS: (id) => `/path/${id}`
 * - Static routes are STRINGS: '/path'
 * 
 * VERSIONING:
 * - Current: v1.0.0 (Revenue Release)
 * - Deferred: v1.1.0+ (Admin, Reviews, Categories, Search)
 * 
 * Last Updated: 2026-02-01
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// 🔐 AUTHENTICATION ROUTES
// ============================================================================

export const AUTH_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  GOOGLE: '/auth/google',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
}

// ============================================================================
// 👤 USER ROUTES
// ============================================================================

export const USER_ROUTES = {
  ME: '/users/me',
  UPDATE_ME: '/users/me',
}

// ============================================================================
// 📍 ADDRESS ROUTES
// ============================================================================

export const ADDRESS_ROUTES = {
  LIST: '/addresses',
  CREATE: '/addresses',
  GET: (id) => `/addresses/${id}`,
  UPDATE: (id) => `/addresses/${id}`,
  DELETE: (id) => `/addresses/${id}`,
}

// ============================================================================
// 🛍️ PRODUCT ROUTES
// ============================================================================

export const PRODUCT_ROUTES = {
  LIST: '/products',
  GET: (id) => `/products/${id}`,
}

// ============================================================================
// 🛒 CART ROUTES
// ============================================================================

export const CART_ROUTES = {
  GET: '/cart',
  ADD_ITEM: '/cart/items',
  UPDATE_ITEM: (itemId) => `/cart/items/${itemId}`,
  DELETE_ITEM: (itemId) => `/cart/items/${itemId}`,
}

// ============================================================================
// 📦 ORDER ROUTES
// ============================================================================

export const ORDER_ROUTES = {
  CREATE: '/orders',
  LIST: '/orders',
  GET: (id) => `/orders/${id}`,
  // ❌ CANCELLED in v1.0.0: Order cancellation removed per business decision
}

// ============================================================================
// 💳 PAYMENT ROUTES
// ============================================================================

export const PAYMENT_ROUTES = {
  INITIATE: '/payments/initiate',
  GET_STATUS: (orderId) => `/payments/${orderId}`,
}

// ============================================================================
// 📂 FILE DOWNLOAD ROUTES
// ============================================================================

export const FILE_ROUTES = {
  LIST_ORDER_FILES: (orderId) => `/orders/${orderId}/files`,
  DOWNLOAD_FILE: (orderId, fileId) => `/orders/${orderId}/files/${fileId}/download`,
}

// ============================================================================
// � CUSTOM FILE UPLOAD ROUTES
// ============================================================================

export const CUSTOM_FILE_ROUTES = {
  UPLOAD: '/custom-files/upload',
  LIST_UPLOADS: '/custom-files/uploads',
}

// ============================================================================
// �📄 INVOICE ROUTES
// ============================================================================

export const INVOICE_ROUTES = {
  GET: (orderId) => `/invoices/order/${orderId}`,
  DOWNLOAD: (orderId) => `/invoices/order/${orderId}/download`,
}

// ============================================================================
// 🚚 SHIPMENT ROUTES
// ============================================================================

export const SHIPMENT_ROUTES = {
  GET_ORDER_SHIPMENT: (orderId) => `/orders/${orderId}/shipment`,
}

// ============================================================================
// 🏥 HEALTH ROUTES (DO NOT USE IN UI)
// ============================================================================

export const HEALTH_ROUTES = {
  HEALTH: '/health',
  READY: '/health/ready',
  DB: '/health/db',
}

// ============================================================================
// ❌ DEFERRED TO v1.1.0+ (NOT AVAILABLE)
// ============================================================================

/**
 * The following endpoints are NOT available in v1.0.0:
 * 
 * 📂 CATEGORIES:
 *    - GET /categories
 *    - GET /categories/:slug
 * 
 * ⭐ REVIEWS:
 *    - POST /reviews
 *    - GET /products/:id/reviews
 * 
 * 🔍 SEARCH:
 *    - GET /products/search?q=...
 * 
 * 👨‍💼 ADMIN:
 *    - All admin endpoints (POST /products, PUT /products/:id, etc.)
 * 
 * DO NOT implement UI for these features.
 * Show "Coming Soon" messaging if users expect them.
 */

// ============================================================================
// HELPER: BUILD FULL API URL
// ============================================================================

/**
 * Prefix route with /api/v1
 * @param {string} route - Route from above constants
 * @returns {string} Full API path
 */
export function buildApiPath(route) {
  return `/api/v1${route}`
}

// ============================================================================
// VALIDATION: ENSURE NO BREAKING CHANGES
// ============================================================================

/**
 * Contract version check
 * Use this in _app.js to validate alignment
 */
export const API_CONTRACT_VERSION = 'v1.0.0'
export const LAST_UPDATED = '2026-02-01'

/**
 * Endpoint count for monitoring
 * If backend adds/removes endpoints, this should trigger review
 */
export const ENDPOINT_COUNT = {
  AUTH: 7,
  USER: 2,
  ADDRESS: 5,
  PRODUCT: 2,
  CART: 4,
  ORDER: 3, // ✅ Removed CANCEL route
  PAYMENT: 2,
  FILE: 2,
  CUSTOM_FILE: 2,
  INVOICE: 2,
  SHIPMENT: 1,
  HEALTH: 3,
  TOTAL: 35, // ✅ Updated after removing CANCEL
}
