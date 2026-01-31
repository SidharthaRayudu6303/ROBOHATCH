// API utility functions for making authenticated requests
// Uses environment-based configuration with httpOnly cookie support

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

/**
 * Make an API request with credentials (httpOnly cookies)
 * @param {string} endpoint - API endpoint (e.g., '/api/v1/products')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const config = {
    credentials: 'include', // Send httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 */
export const apiGet = async (endpoint, options = {}) => {
  return apiFetch(endpoint, {
    method: 'GET',
    ...options,
  })
}

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional fetch options
 */
export const apiPost = async (endpoint, data = null, options = {}) => {
  return apiFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : null,
    ...options,
  })
}

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional fetch options
 */
export const apiPut = async (endpoint, data = null, options = {}) => {
  return apiFetch(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : null,
    ...options,
  })
}

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 */
export const apiDelete = async (endpoint, options = {}) => {
  return apiFetch(endpoint, {
    method: 'DELETE',
    ...options,
  })
}

/**
 * Check if user is authenticated by checking session
 * @returns {Promise<boolean>}
 */
export const checkAuth = async () => {
  try {
    const response = await apiGet('/api/v1/auth/me')
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get current user profile
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiGet('/api/v1/auth/me')
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch {
    return null
  }
}

/**
 * Logout user by calling logout endpoint
 * @returns {Promise<boolean>}
 */
export const logout = async () => {
  try {
    const response = await apiPost('/api/v1/auth/logout')
    if (response.ok) {
      // Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChanged'))
      }
      return true
    }
    return false
  } catch {
    return false
  }
}

// Legacy functions for backward compatibility (will be removed)
export const getAuthToken = () => {
  console.warn('getAuthToken is deprecated. Using httpOnly cookies now.')
  return null
}

export const setAuthToken = () => {
  console.warn('setAuthToken is deprecated. Using httpOnly cookies now.')
}

export const removeAuthToken = () => {
  console.warn('removeAuthToken is deprecated. Using httpOnly cookies now.')
}

export const authenticatedFetch = apiFetch
