const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

const handleLogout = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:logout'))
    window.location.href = '/login'
  }
}

const request = async (endpoint, config = {}) => {
  const { method = 'GET', body = null, headers = {} } = config

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  const options = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  }

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)

    if (response.status === 401) {
      handleLogout()
      throw new APIError('Unauthorized', 401, null)
    }

    if (response.status === 500) {
      throw new APIError('Server error. Please try again later.', 500, null)
    }

    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    let data = null
    if (isJson) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      throw new APIError(
        data?.message || data?.error || `Request failed with status ${response.status}`,
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network error. Please check your connection.', 0, null)
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} config - Request configuration
 * @returns {Promise<any>}
 */
export const get = (endpoint, config = {}) => {
  return request(endpoint, { ...config, method: 'GET' })
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} config - Request configuration
 * @returns {Promise<any>}
 */
export const post = (endpoint, body = null, config = {}) => {
  return request(endpoint, { ...config, method: 'POST', body })
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} config - Request configuration
 * @returns {Promise<any>}
 */
export const put = (endpoint, body = null, config = {}) => {
  return request(endpoint, { ...config, method: 'PUT', body })
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} config - Request configuration
 * @returns {Promise<any>}
 */
export const del = (endpoint, config = {}) => {
  return request(endpoint, { ...config, method: 'DELETE' })
}

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {Object} config - Request configuration
 * @returns {Promise<any>}
 */
export const patch = (endpoint, body = null, config = {}) => {
  return request(endpoint, { ...config, method: 'PATCH', body })
}

const apiClient = {
  get,
  post,
  put,
  delete: del,
  patch,
