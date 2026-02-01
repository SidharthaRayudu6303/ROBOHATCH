/**
 * Centralized Error Handler for ROBOHATCH
 * Maps backend API errors to user-friendly messages
 * Handles all HTTP status codes consistently
 */

export class ApiError extends Error {
  constructor(message, statusCode, data = {}) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
    this.isApiError = true
  }
}

/**
 * Translate backend errors to user-friendly messages
 * @param {Object} error - Backend error response
 * @param {number} statusCode - HTTP status code
 * @returns {Object} { message, action, isValidation }
 */
export function translateApiError(error, statusCode) {
  const errorMap = {
    400: {
      message: 'Invalid request. Please check your input and try again.',
      isValidation: true
    },
    401: {
      message: 'Your session has expired. Please login again.',
      action: 'logout'
    },
    403: {
      message: 'You do not have permission to perform this action.',
      action: 'redirect_home'
    },
    404: {
      message: 'The requested resource was not found.',
      action: 'show_error'
    },
    409: {
      message: 'This item already exists or conflicts with existing data.',
      isValidation: true
    },
    422: {
      message: error?.message || 'Please check your input and try again.',
      isValidation: true,
      validationErrors: error?.errors || []
    },
    429: {
      message: 'Too many requests. Please wait a moment and try again.',
      action: 'retry_delay',
      retryAfter: 5000
    },
    500: {
      message: 'Something went wrong on our end. Please try again later.',
      action: 'show_error'
    },
    502: {
      message: 'Service temporarily unavailable. Please try again.',
      action: 'retry'
    },
    503: {
      message: 'Service is under maintenance. Please try again shortly.',
      action: 'show_maintenance'
    },
    504: {
      message: 'Request timeout. Please check your connection and try again.',
      action: 'retry'
    }
  }

  const mapped = errorMap[statusCode] || {
    message: 'An unexpected error occurred. Please try again.',
    action: 'show_error'
  }

  return {
    ...mapped,
    originalError: error,
    statusCode
  }
}

/**
 * Handle API errors globally
 * @param {Error|ApiError} error 
 * @param {Object} options - { showAlert, onLogout }
 */
export function handleApiError(error, options = {}) {
  const { showAlert = true, onLogout } = options

  if (error.isApiError) {
    const errorData = error.data

    // Handle specific actions
    switch (errorData.action) {
      case 'logout':
        if (onLogout) {
          onLogout()
        } else {
          window.dispatchEvent(new Event('authChanged'))
          window.location.href = '/login'
        }
        break

      case 'redirect_home':
        window.location.href = '/'
        break

      case 'retry':
        if (showAlert) {
          alert(error.message + ' Retrying...')
        }
        break

      case 'show_maintenance':
        window.location.href = '/maintenance'
        break

      default:
        if (showAlert) {
          alert(error.message)
        }
    }

    return errorData
  }

  // Network or unknown error
  const defaultMessage = 'Network error. Please check your connection.'
  if (showAlert) {
    alert(defaultMessage)
  }

  return { message: defaultMessage, statusCode: 0 }
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise}
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on certain errors
      if (error.isApiError) {
        const shouldRetry = [502, 503, 504, 429].includes(error.statusCode)
        if (!shouldRetry) {
          throw error
        }
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Map backend validation errors to form field errors
 * @param {Object} backendError - Backend validation error response
 * @returns {Object} Field-to-error-message mapping
 */
export function mapValidationErrors(backendError) {
  if (!backendError?.errors || !Array.isArray(backendError.errors)) {
    return {}
  }

  const fieldErrors = {}
  
  backendError.errors.forEach(error => {
    const field = error.field || error.path
    const message = error.message || error.msg
    
    if (field && message) {
      fieldErrors[field] = message
    }
  })

  return fieldErrors
}
