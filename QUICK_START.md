# 🚀 Quick Start Guide - ROBOHATCH Integration

## For Developers Joining the Project

---

## 1️⃣ Setup (5 minutes)

### Clone & Install
```bash
# Navigate to frontend
cd ROBOHATCH_frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1" > .env.local
```

### Start Development
```bash
# Terminal 1: Start Backend (NestJS)
cd ../robohatch
npm run start:dev

# Terminal 2: Start Frontend (Next.js)
cd ../ROBOHATCH_frontend
npm run dev
```

**Frontend**: http://localhost:3001  
**Backend**: http://localhost:3000

---

## 2️⃣ Making API Calls (The Only Way)

### Import the API Client
```javascript
import apiClient from '../utils/apiClient'
```

### Examples

#### Public Endpoint (No Auth)
```javascript
const products = await apiClient.get('/products', { requireAuth: false })
```

#### Authenticated Endpoint
```javascript
const profile = await apiClient.get('/auth/profile')
// Token automatically attached
```

#### POST Request
```javascript
const order = await apiClient.post('/orders/checkout', {
  items: cartItems,
  total: 1299
})
```

### ⚠️ NEVER DO THIS
```javascript
// ❌ WRONG - Don't use fetch directly
const response = await fetch('http://localhost:3000/api/v1/products')

// ✅ CORRECT - Always use apiClient
const products = await apiClient.get('/products', { requireAuth: false })
```

---

## 3️⃣ Authentication Pattern

### Login
```javascript
const response = await apiClient.post('/auth/login', {
  email,
  password
}, { requireAuth: false })

apiClient.setToken(response.accessToken)
window.dispatchEvent(new Event('authChanged'))
router.push('/profile')
```

### Check if Logged In
```javascript
if (apiClient.isAuthenticated()) {
  // User has valid token
}
```

### Logout
```javascript
apiClient.removeToken()
router.push('/')
```

---

## 4️⃣ Protected Pages Pattern

```javascript
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import apiClient from '../utils/apiClient'

export default function ProtectedPage() {
  const router = useRouter()

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  return <div>Protected Content</div>
}
```

---

## 5️⃣ Error Handling Pattern

```javascript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)

const fetchData = async () => {
  try {
    setIsLoading(true)
    setError(null)
    
    const data = await apiClient.get('/endpoint')
    // Use data
  } catch (err) {
    setError(err.message)
    // Error automatically handled by apiClient
    // 401 errors auto-redirect to login
  } finally {
    setIsLoading(false)
  }
}
```

---

## 6️⃣ Common Tasks

### Add New API Endpoint
```javascript
// Just use apiClient - configuration already done
const newData = await apiClient.post('/new-endpoint', data)
```

### Change Backend URL
```bash
# Edit .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.production.com/v1
```

### Check Token
```javascript
const token = apiClient.getToken()
console.log('Has token:', !!token)
```

---

## 7️⃣ Project Structure

```
ROBOHATCH_frontend/
├── utils/
│   └── apiClient.js          ← THE API CLIENT (use this everywhere)
├── pages/
│   ├── login.js              ← Authentication example
│   ├── profile.js            ← Protected page example
│   └── index.js              ← Home page
├── components/
│   └── Navbar.js             ← Auth state example
└── .env.local                ← Backend URL configuration
```

---

## 8️⃣ Backend Endpoints (Available)

```
POST   /auth/login         - User login
POST   /auth/register      - User registration
GET    /auth/profile       - Get current user (authenticated)
GET    /products           - List all products
GET    /products/:id       - Get single product
POST   /cart/items         - Add item to cart (authenticated)
GET    /cart               - Get user's cart (authenticated)
POST   /orders/checkout    - Create order (authenticated)
```

---

## 9️⃣ Debugging

### Check if Backend is Running
```bash
curl http://localhost:3000/api/v1/products
```

### Check Token in Browser
```javascript
// In browser console
localStorage.getItem('auth_token')
```

### Clear Token (Force Logout)
```javascript
// In browser console
localStorage.removeItem('auth_token')
window.location.reload()
```

---

## 🔟 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Network error" | Backend not running | Start backend: `npm run start:dev` |
| "Unauthorized" | Invalid/expired token | Logout and login again |
| 404 on API call | Wrong endpoint | Check backend endpoint exists |
| CORS error | Backend CORS not configured | Check backend CORS settings |

---

## 📚 Documentation

- **Full Integration Guide**: `FRONTEND_BACKEND_INTEGRATION.md`
- **Technical Details**: `INTEGRATION_SUMMARY.js`
- **API Client Source**: `utils/apiClient.js`

---

## ✅ Quick Checklist for New Features

- [ ] Import `apiClient` from `utils/apiClient`
- [ ] Use `apiClient.get()` / `.post()` / `.put()` / `.delete()`
- [ ] Add `{ requireAuth: false }` for public endpoints
- [ ] Add loading states (`isLoading`)
- [ ] Add error handling (`try/catch`)
- [ ] Show user-friendly error messages
- [ ] Test with backend running

---

## 🎯 Remember

1. **Always use `apiClient`** - Never use `fetch` directly
2. **Environment variables** - Backend URL in `.env.local`
3. **Token is automatic** - apiClient handles it
4. **401 auto-redirects** - Don't manually handle auth errors
5. **No console logs** - Use error states instead

---

## 🆘 Need Help?

1. Check `utils/apiClient.js` for available methods
2. Look at `pages/login.js` for authentication example
3. Look at `pages/profile.js` for protected page example
4. Look at `components/Navbar.js` for auth state example
5. Read `INTEGRATION_SUMMARY.js` for complete technical docs

---

**Happy Coding! 🚀**

*Remember: When in doubt, check `pages/login.js` - it has everything you need.*
