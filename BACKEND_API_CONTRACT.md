# 🔌 ROBOHATCH BACKEND API CONTRACT
## Complete API Specification for Frontend-Backend Integration

**Version:** 1.0  
**Backend:** https://robohatch-backend-production.up.railway.app  
**Base Path:** `/api/v1`  
**Auth Method:** Cookie-based (httpOnly cookies)

---

## 📋 TABLE OF CONTENTS

1. [Authentication & Authorization](#authentication--authorization)
2. [Products](#products)
3. [Categories](#categories)
4. [Cart](#cart)
5. [Orders](#orders)
6. [Payments](#payments)
7. [User Management](#user-management)
8. [Admin Operations](#admin-operations)
9. [Custom Uploads](#custom-uploads)
10. [Error Handling](#error-handling)

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Register New User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "mobile": "1234567890"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Sets Cookie:** `auth_token` (httpOnly, secure, sameSite)

---

### Login
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Sets Cookie:** `auth_token` (httpOnly, secure)

---

### Get Current User
```http
GET /api/v1/users/me
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "mobile": "1234567890",
  "role": "customer",
  "createdAt": "2026-01-15T10:00:00Z"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized",
  "message": "Please login to continue"
}
```

---

### Logout
```http
POST /api/v1/auth/logout
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Clears Cookie:** `auth_token`

---

## 📦 PRODUCTS

### Get All Products (Paginated)
```http
GET /api/v1/products?page=1&limit=20&category=keychains&search=custom
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Category slug filter
- `search` (optional): Search term
- `sort` (optional): `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`

**Success Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Custom Photo Keychain",
      "description": "Personalized keychain with your photo",
      "price": 299,
      "category": {
        "id": "uuid",
        "name": "Keychains",
        "slug": "keychains"
      },
      "imageUrl": "https://s3.amazonaws.com/bucket/products/image.jpg",
      "stock": 50,
      "isActive": true,
      "isFeatured": false,
      "createdAt": "2026-01-20T10:00:00Z",
      "updatedAt": "2026-01-25T15:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 94,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Single Product
```http
GET /api/v1/products/:id
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "Custom Photo Keychain",
  "description": "Detailed product description with specifications...",
  "price": 299,
  "category": {
    "id": "uuid",
    "name": "Keychains",
    "slug": "keychains"
  },
  "imageUrl": "https://s3.amazonaws.com/bucket/products/main.jpg",
  "images": [
    "https://s3.amazonaws.com/bucket/products/main.jpg",
    "https://s3.amazonaws.com/bucket/products/alt1.jpg",
    "https://s3.amazonaws.com/bucket/products/alt2.jpg"
  ],
  "stock": 50,
  "isActive": true,
  "isFeatured": false,
  "specifications": {
    "material": "PLA Plastic",
    "dimensions": "5x3 cm",
    "weight": "10g"
  },
  "createdAt": "2026-01-20T10:00:00Z",
  "updatedAt": "2026-01-25T15:30:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Not Found",
  "message": "Product not found"
}
```

---

## 📂 CATEGORIES

### Get All Categories
```http
GET /api/v1/categories
```

**Success Response (200):**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Keychains",
      "slug": "keychains",
      "description": "Personalized and custom 3D printed keychains",
      "imageUrl": "https://s3.amazonaws.com/bucket/categories/keychains.jpg",
      "isActive": true,
      "productCount": 24,
      "order": 1,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Home Decor",
      "slug": "homedecor",
      "description": "Beautiful decorative items to enhance your living space",
      "imageUrl": "https://s3.amazonaws.com/bucket/categories/homedecor.jpg",
      "isActive": true,
      "productCount": 18,
      "order": 2,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Category by Slug
```http
GET /api/v1/categories/:slug
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "Keychains",
  "slug": "keychains",
  "description": "Personalized and custom 3D printed keychains",
  "imageUrl": "https://s3.amazonaws.com/bucket/categories/keychains.jpg",
  "isActive": true,
  "productCount": 24,
  "order": 1,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## 🛒 CART

### Get User Cart
```http
GET /api/v1/cart
```

**Auth Required:** Yes (cookie)

**Success Response (200):**
```json
{
  "items": [
    {
      "id": "cart-item-uuid",
      "product": {
        "id": "product-uuid",
        "name": "Custom Photo Keychain",
        "price": 299,
        "imageUrl": "https://s3.amazonaws.com/...",
        "stock": 50
      },
      "quantity": 2,
      "subtotal": 598
    }
  ],
  "subtotal": 598,
  "shipping": 100,
  "tax": 0,
  "total": 698,
  "itemCount": 2
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized",
  "message": "Please login to view cart"
}
```

---

### Add Item to Cart
```http
POST /api/v1/cart/items
```

**Auth Required:** Yes

**Request Body:**
```json
{
  "productId": "product-uuid",
  "quantity": 1
}
```

**Success Response (200):**
```json
{
  "message": "Item added to cart",
  "cart": {
    "items": [...],
    "subtotal": 897,
    "shipping": 100,
    "tax": 0,
    "total": 997,
    "itemCount": 3
  }
}
```

**Error Response (400):**
```json
{
  "error": "Bad Request",
  "message": "Product is out of stock"
}
```

---

### Update Cart Item Quantity
```http
PUT /api/v1/cart/items/:itemId
```

**Auth Required:** Yes

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "message": "Cart updated",
  "cart": {
    "items": [...],
    "subtotal": 897,
    "total": 997
  }
}
```

---

### Remove Item from Cart
```http
DELETE /api/v1/cart/items/:itemId
```

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Item removed from cart",
  "cart": {
    "items": [...],
    "subtotal": 299,
    "total": 399
  }
}
```

---

## 📋 ORDERS

### Create Order (Checkout)
```http
POST /api/v1/orders
```

**Auth Required:** Yes

**Headers:**
```
Idempotency-Key: uuid-v4-generated-by-frontend
```

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "orderNotes": "Optional delivery instructions"
}
```

**Success Response (201):**
```json
{
  "orderId": "order-uuid",
  "orderNumber": "ORD-2026-00001",
  "total": 997,
  "status": "pending_payment",
  "createdAt": "2026-02-01T10:00:00Z",
  "message": "Order created successfully"
}
```

**Note:** Backend automatically:
- Creates order from user's cart
- Clears cart after order creation
- Reduces product stock
- Sends order confirmation email

---

### Get User Orders
```http
GET /api/v1/orders?page=1&limit=10&status=pending
```

**Auth Required:** Yes

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Success Response (200):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2026-00001",
      "status": "pending_payment",
      "total": 997,
      "items": [
        {
          "product": {
            "id": "uuid",
            "name": "Custom Photo Keychain",
            "imageUrl": "https://..."
          },
          "quantity": 2,
          "price": 299,
          "subtotal": 598
        }
      ],
      "shippingAddress": {...},
      "createdAt": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-02-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### Get Single Order
```http
GET /api/v1/orders/:id
```

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-2026-00001",
  "status": "completed",
  "items": [...],
  "subtotal": 598,
  "shipping": 100,
  "tax": 0,
  "total": 698,
  "shippingAddress": {...},
  "paymentMethod": "razorpay",
  "paymentStatus": "paid",
  "paidAt": "2026-02-01T10:05:00Z",
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-02-01T11:00:00Z"
}
```

---

## 💳 PAYMENTS

### Initiate Payment
```http
POST /api/v1/payments/initiate
```

**Auth Required:** Yes

**Request Body:**
```json
{
  "orderId": "order-uuid"
}
```

**Success Response (200):**
```json
{
  "paymentId": "payment-uuid",
  "paymentUrl": "https://razorpay.com/payment/...",
  "amount": 997,
  "currency": "INR",
  "orderId": "order-uuid"
}
```

**Frontend Action:** Redirect user to `paymentUrl`

---

### Get Payment Status
```http
GET /api/v1/payments/:orderId
```

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "status": "paid",
  "paymentId": "payment-uuid",
  "amount": 997,
  "paidAt": "2026-02-01T10:05:00Z",
  "orderId": "order-uuid"
}
```

**Possible Statuses:**
- `pending` - Awaiting payment
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## 👤 USER MANAGEMENT

### Get User Profile
```http
GET /api/v1/users/profile
```

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "mobile": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### Update User Profile
```http
PUT /api/v1/users/profile
```

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "John Smith",
  "mobile": "9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  }
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## 👨‍💼 ADMIN OPERATIONS

**All admin routes require:** `role: admin` in auth cookie

### Create Product
```http
POST /api/v1/admin/products
```

**Auth Required:** Admin only

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 499,
  "categoryId": "category-uuid",
  "stock": 100,
  "imageUrl": "https://s3.amazonaws.com/...",
  "isActive": true,
  "isFeatured": false,
  "specifications": {
    "material": "PLA",
    "color": "Red"
  }
}
```

**Success Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "uuid",
    "name": "New Product",
    ...
  }
}
```

---

### Update Product
```http
PUT /api/v1/admin/products/:id
```

**Auth Required:** Admin only

**Request Body:** (Same as create, all fields optional)

**Success Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {...}
}
```

---

### Delete Product
```http
DELETE /api/v1/admin/products/:id
```

**Auth Required:** Admin only

**Success Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Create Category
```http
POST /api/v1/admin/categories
```

**Auth Required:** Admin only

**Request Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "imageUrl": "https://...",
  "isActive": true,
  "order": 10
}
```

---

### Update Category
```http
PUT /api/v1/admin/categories/:id
```

**Auth Required:** Admin only

---

### Delete Category
```http
DELETE /api/v1/admin/categories/:id
```

**Auth Required:** Admin only

---

### Get All Orders (Admin)
```http
GET /api/v1/admin/orders?status=pending&page=1
```

**Auth Required:** Admin only

**Success Response (200):**
```json
{
  "orders": [...],
  "pagination": {...},
  "stats": {
    "totalOrders": 152,
    "pendingOrders": 12,
    "completedOrders": 130,
    "totalRevenue": 45670
  }
}
```

---

### Update Order Status
```http
PUT /api/v1/admin/orders/:id/status
```

**Auth Required:** Admin only

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Order Statuses:**
- `pending_payment` - Awaiting payment
- `paid` - Payment confirmed
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
- `refunded` - Order refunded

---

## 📤 CUSTOM UPLOADS

### Upload Custom File
```http
POST /api/v1/custom-files/upload
```

**Content-Type:** `multipart/form-data`

**Auth Required:** Optional (can be used by guests)

**Form Data:**
```
file: (binary)
name: "John Doe"
email: "john@example.com"
phone: "1234567890"
description: "Custom print requirements"
```

**Success Response (200):**
```json
{
  "uploadId": "upload-uuid",
  "message": "File uploaded successfully. We will contact you shortly.",
  "email": "Email sent to admin"
}
```

**Note:** Backend emails file to admin, no S3 storage

---

### Get User Uploads
```http
GET /api/v1/custom-files/uploads
```

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "uploads": [
    {
      "id": "uuid",
      "fileName": "design.stl",
      "description": "Custom requirements",
      "status": "pending",
      "createdAt": "2026-02-01T10:00:00Z"
    }
  ]
}
```

---

## ⚠️ ERROR HANDLING

### Standard Error Response Format
```json
{
  "error": "Error Type",
  "message": "User-friendly error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "statusCode": 400,
  "timestamp": "2026-02-01T10:00:00Z"
}
```

### HTTP Status Codes Used

| Code | Meaning | Frontend Action |
|------|---------|----------------|
| 200 | OK | Show success |
| 201 | Created | Show success |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to login, clear auth state |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show not found page |
| 409 | Conflict | Show conflict error |
| 422 | Validation Error | Map to form fields |
| 429 | Too Many Requests | Show rate limit message, retry after delay |
| 500 | Server Error | Show generic error, hide details |
| 502 | Bad Gateway | Retry with backoff |
| 503 | Service Unavailable | Show maintenance page |
| 504 | Gateway Timeout | Retry with backoff |

---

## 🔒 SECURITY NOTES

1. **All requests use httpOnly cookies** - No JWT in localStorage
2. **CORS enabled** for frontend domain only
3. **CSRF protection** implemented (verify with backend team)
4. **Rate limiting** enforced on all endpoints
5. **Input validation** on backend - frontend validation is UX only
6. **File uploads** - Max 10MB, allowed types: STL, OBJ, ZIP
7. **XSS protection** - All user input sanitized on backend

---

## 📊 RATE LIMITS

| Endpoint Type | Limit |
|--------------|-------|
| Auth (login/register) | 5 requests/15 min per IP |
| Products (GET) | 100 requests/min per IP |
| Cart operations | 50 requests/min per user |
| Order creation | 5 requests/hour per user |
| Admin operations | 200 requests/min per admin |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1738393200
```

---

## 🚀 FRONTEND IMPLEMENTATION CHECKLIST

- [x] All API calls use `lib/api.js` (single client)
- [x] Timeout set to 30s with AbortController
- [x] Centralized error handling via `lib/errorHandler.js`
- [x] Auto-logout on 401
- [x] Cart count fetched from backend
- [x] No hardcoded products/categories
- [x] Error Boundary catches all React errors
- [ ] Implement pagination for products
- [ ] Add loading states for all API calls
- [ ] Map backend validation errors to form fields
- [ ] Add retry logic for failed requests
- [ ] Test all error scenarios (401, 403, 404, 500, etc.)

---

**Contract Version:** 1.0  
**Last Updated:** February 1, 2026  
**Maintained By:** Backend Team  
**Questions:** Contact backend team for API clarifications
