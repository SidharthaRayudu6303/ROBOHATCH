// Security utility functions

// XSS Protection - Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .replace(/onload=/gi, '')
    .trim()
}

// SQL Injection Protection - Validate inputs
export const validateInput = (input, type = 'text') => {
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(input)
    
    case 'phone':
      const phoneRegex = /^[\d\s\-\+\(\)]+$/
      return phoneRegex.test(input)
    
    case 'number':
      return !isNaN(input) && input.length < 20
    
    case 'alphanumeric':
      const alphanumericRegex = /^[a-zA-Z0-9\s]+$/
      return alphanumericRegex.test(input)
    
    default:
      return input.length < 1000 && !/[<>]/.test(input)
  }
}

// Rate Limiting - Prevent brute force attacks
const rateLimitStore = {}

export const checkRateLimit = (identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const now = Date.now()
  
  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = { attempts: 1, resetTime: now + windowMs }
    return { allowed: true, remaining: maxAttempts - 1 }
  }
  
  const record = rateLimitStore[identifier]
  
  // Reset if window has passed
  if (now > record.resetTime) {
    rateLimitStore[identifier] = { attempts: 1, resetTime: now + windowMs }
    return { allowed: true, remaining: maxAttempts - 1 }
  }
  
  // Check if limit exceeded
  if (record.attempts >= maxAttempts) {
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    }
  }
  
  // Increment attempts
  record.attempts += 1
  return { allowed: true, remaining: maxAttempts - record.attempts }
}

// CSRF Protection - Generate and validate tokens
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36)
}

export const validateCSRFToken = (token, storedToken) => {
  return token === storedToken && token.length > 20
}

// Secure Local Storage - Encrypt sensitive data
export const secureStorage = {
  set: (key, value) => {
    try {
      const data = JSON.stringify(value)
      // In production, use proper encryption
      const encoded = btoa(encodeURIComponent(data))
      localStorage.setItem(key, encoded)
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  },
  
  get: (key) => {
    try {
      const encoded = localStorage.getItem(key)
      if (!encoded) return null
      const data = decodeURIComponent(atob(encoded))
      return JSON.parse(data)
    } catch (error) {
      console.error('Retrieval error:', error)
      return null
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key)
  }
}

// Content Security - Validate URLs
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// Password Strength Validation
export const validatePasswordStrength = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Prevent clickjacking
export const preventClickjacking = () => {
  if (window.self !== window.top) {
    window.top.location = window.self.location
  }
}
