# API Refactoring Examples - httpOnly Cookie Authentication

## Overview
This project now uses environment-based API configuration with httpOnly cookies for secure authentication.

---

## Environment Configuration

### .env.local
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.robohatch.com
```

---

## 1. API Utility Functions (utils/api.js)

### Basic Usage

```javascript
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/api'

// GET request
const products = await apiGet('/api/v1/products')
const data = await products.json()

// POST request
const response = await apiPost('/api/v1/orders', {
  items: [{ productId: 1, quantity: 2 }],
  total: 2598
})

// PUT request
await apiPut('/api/v1/user/profile', {
  name: 'John Doe',
  phone: '1234567890'
})

// DELETE request
await apiDelete('/api/v1/cart/item/123')
```

---

## 2. Authentication Examples

### Login Request (Frontend)

```javascript
// pages/login.js
import { useRouter } from 'next/router'

const handleLogin = async (e) => {
  e.preventDefault()
  
  try {
    // Call Next.js API route (not backend directly)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Login failed')
      return
    }

    // Cookie is automatically set by browser
    // Dispatch event for UI updates
    window.dispatchEvent(new Event('authChanged'))
    
    router.push('/profile')
  } catch (err) {
    setError('Network error')
  }
}
```

### Register Request (Frontend)

```javascript
// pages/login.js
const handleRegister = async (e) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        name,
        phone 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Registration failed')
      return
    }

    window.dispatchEvent(new Event('authChanged'))
    router.push('/profile')
  } catch (err) {
    setError('Network error')
  }
}
```

### Logout Request (Frontend)

```javascript
// components/Navbar.js
const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (response.ok) {
      window.dispatchEvent(new Event('authChanged'))
      router.push('/')
    }
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
```

---

## 3. Authenticated Requests

### Check Authentication Status

```javascript
// components/Navbar.js
import { checkAuth, getCurrentUser } from '@/utils/api'

useEffect(() => {
  const verifyAuth = async () => {
    const isAuth = await checkAuth()
    setIsAuthenticated(isAuth)
    
    if (isAuth) {
      const user = await getCurrentUser()
      setUser(user)
    }
  }
  
  verifyAuth()
  
  window.addEventListener('authChanged', verifyAuth)
  return () => window.removeEventListener('authChanged', verifyAuth)
}, [])
```

### Fetch User Profile

```javascript
// pages/profile.js
import { apiGet } from '@/utils/api'

useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        router.push('/login')
        return
      }

      const data = await response.json()
      setUser(data.user || data.data)
    } catch (err) {
      console.error('Failed to load profile:', err)
      router.push('/login')
    }
  }

  loadProfile()
}, [])
```

### Update User Profile

```javascript
// pages/profile.js
const handleSaveProfile = async () => {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Update failed')
      return
    }

    alert('Profile updated successfully!')
  } catch (err) {
    setError('Network error')
  }
}
```

---

## 4. Making Direct Backend Calls (From Frontend)

### Fetch Products

```javascript
// pages/index.js
import { apiGet } from '@/utils/api'

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await apiGet('/api/v1/products')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || data.data)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  fetchProducts()
}, [])
```

### Create Order

```javascript
// pages/checkout.js
import { apiPost } from '@/utils/api'

const handlePlaceOrder = async () => {
  try {
    const response = await apiPost('/api/v1/orders', {
      items: cartItems,
      shippingAddress: formData,
      paymentMethod: formData.paymentMethod,
      total: total,
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Order failed')
      return
    }

    // Clear cart
    localStorage.setItem('cart', '[]')
    window.dispatchEvent(new Event('cartUpdated'))
    
    router.push(`/order-success/${data.orderId}`)
  } catch (err) {
    setError('Network error')
  }
}
```

### Fetch Order History

```javascript
// pages/my-orders.js
import { apiGet } from '@/utils/api'

useEffect(() => {
  const loadOrders = async () => {
    try {
      const response = await apiGet('/api/v1/orders')
      
      if (!response.ok) {
        router.push('/login')
        return
      }

      const data = await response.json()
      setOrders(data.orders || data.data)
    } catch (err) {
      console.error('Failed to load orders:', err)
    }
  }

  loadOrders()
}, [])
```

---

## 5. Error Handling Pattern

```javascript
const makeApiCall = async () => {
  try {
    const response = await apiPost('/api/v1/endpoint', data)
    const result = await response.json()

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 401) {
        // Unauthorized - redirect to login
        router.push('/login')
        return
      }
      
      if (response.status === 403) {
        // Forbidden
        setError('Access denied')
        return
      }

      if (response.status >= 400 && response.status < 500) {
        // Client error
        setError(result.error || 'Request failed')
        return
      }

      // Server error
      setError('Server error. Please try again later.')
      return
    }

    // Success
    return result
  } catch (err) {
    // Network error
    console.error('Network error:', err)
    setError('Unable to connect to server')
  }
}
```

---

## 6. Protected Routes Pattern

```javascript
// components/ProtectedRoute.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { checkAuth } from '@/utils/api'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const auth = await checkAuth()
      setIsAuthenticated(auth)
      setIsLoading(false)

      if (!auth) {
        router.push('/login')
      }
    }

    verify()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? children : null
}

// Usage in pages/profile.js
export default function Profile() {
  return (
    <ProtectedRoute>
      <div>Profile Content</div>
    </ProtectedRoute>
  )
}
```

---

## 7. API Routes Best Practices

### Middleware Pattern

```javascript
// pages/api/middleware/auth.js
export const requireAuth = async (req, res, handler) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  try {
    // Verify session with backend
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookie': req.headers.cookie || '',
      },
    })

    if (!response.ok) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await response.json()
    req.user = user

    return handler(req, res)
  } catch (err) {
    return res.status(500).json({ error: 'Authentication check failed' })
  }
}

// Usage
import { requireAuth } from './middleware/auth'

export default async function handler(req, res) {
  return requireAuth(req, res, async (req, res) => {
    // Protected handler logic
    const user = req.user
    // ...
  })
}
```

---

## 8. Key Differences from localStorage Approach

### Before (localStorage + JWT)
```javascript
// ❌ Old approach
localStorage.setItem('token', token)
const token = localStorage.getItem('token')

fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### After (httpOnly Cookies)
```javascript
// ✅ New approach
// No manual token management needed!

fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Browser handles cookies automatically
  body: JSON.stringify({ email, password })
})

// All subsequent requests
fetch('/api/user/profile', {
  credentials: 'include' // Cookie sent automatically
})
```

---

## 9. Backend Requirements

Your backend must:

1. **Set httpOnly cookies on login:**
```javascript
// Example backend response
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})
```

2. **Verify cookies on protected routes:**
```javascript
// Middleware to extract token from cookie
const token = req.cookies.token
```

3. **Clear cookies on logout:**
```javascript
res.clearCookie('token')
```

4. **Enable CORS with credentials:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

---

## 10. Security Benefits

✅ **XSS Protection**: Tokens not accessible via JavaScript  
✅ **CSRF Protection**: Use SameSite=Strict  
✅ **Automatic expiry**: MaxAge handles session timeout  
✅ **No token management**: Browser handles everything  
✅ **Works across tabs**: Shared cookie session  

---

## Migration Checklist

- [x] Update utils/api.js with environment-based config
- [x] Create .env.local with NEXT_PUBLIC_API_BASE_URL
- [x] Update all API routes to use credentials: 'include'
- [x] Remove localStorage token management
- [x] Update login.js to forward cookies
- [x] Create register.js API route
- [x] Create logout.js API route
- [x] Update profile.js API route
- [ ] Update all frontend pages to use new API pattern
- [ ] Update Navbar.js authentication check
- [ ] Update profile.js to fetch from API
- [ ] Remove all localStorage.getItem('auth_token') calls
- [ ] Test authentication flow end-to-end
- [ ] Update backend to support httpOnly cookies

---

**Note**: All frontend API calls should go through Next.js API routes (`/api/*`) which then forward to the backend. This allows proper cookie handling and prevents CORS issues.
