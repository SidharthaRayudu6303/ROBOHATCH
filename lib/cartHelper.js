/**
 * Cart Helper - Backend-only cart operations
 * 
 * This module provides a clean abstraction for all cart operations.
 * All cart data comes from backend API - NO localStorage.
 */

import { addToCart as apiAddToCart } from './api'

/**
 * Add product to cart (backend)
 * @param {Object} product - Product object with id
 * @param {number} quantity - Quantity to add
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addProductToCart(product, quantity = 1) {
  try {
    await apiAddToCart(product.id, quantity)
    
    // Dispatch cart update event for Navbar to refresh count
    window.dispatchEvent(new Event('cartUpdated'))
    
    return { success: true }
  } catch (error) {
    console.error('Failed to add to cart:', error)
    
    // Handle specific error cases
    if (error.statusCode === 401) {
      return { 
        success: false, 
        error: 'Please login to add items to cart',
        requiresAuth: true 
      }
    }
    
    if (error.statusCode === 400) {
      return { 
        success: false, 
        error: error.message || 'Product is out of stock' 
      }
    }
    
    return { 
      success: false, 
      error: 'Failed to add item to cart. Please try again.' 
    }
  }
}

/**
 * LEGACY SUPPORT: For files that haven't been updated yet
 * This function mimics old localStorage behavior but uses backend
 * DO NOT USE IN NEW CODE - Use addProductToCart instead
 * @deprecated
 */
export function addToCartLegacy(product, quantity = 1) {
  console.warn('addToCartLegacy is deprecated. Use addProductToCart instead.')
  return addProductToCart(product, quantity)
}
