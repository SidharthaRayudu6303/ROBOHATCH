# S3 Product Images Flow

## Architecture Overview

This document explains how product images are handled using AWS S3, following best practices where the backend controls image URL generation.

## Flow Diagram

```
Database (MySQL)          Backend (Node.js)         Frontend (Next.js)
┌─────────────┐          ┌─────────────┐           ┌─────────────┐
│ products    │          │             │           │             │
│ ───────     │          │ GET /api/   │           │ Receives    │
│ id: 1       │   ──→    │ v1/products │   ──→     │ complete    │
│ name: ...   │          │             │           │ data with   │
│ price: 799  │          │ Generates   │           │ imageUrl    │
│ image_key:  │          │ S3 URLs     │           │             │
│ idols/      │          │             │           │             │
│ krishna.jpg │          └─────────────┘           └─────────────┘
└─────────────┘
```

## Phase 1: Database Structure

### Products Table Schema
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_key VARCHAR(500),  -- ONLY stores S3 key
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Example Data
```sql
INSERT INTO products (name, price, image_key) VALUES
('Krishna Idol', 799, 'idols/krishna.jpg'),
('Ganesha Idol', 899, 'idols/ganesha.jpg'),
('Buddha Statue', 1099, 'idols/buddha.jpg');
```

**✅ Database stores ONLY the S3 key**
- ❌ NOT: `https://bucket.s3.amazonaws.com/idols/krishna.jpg`
- ✅ YES: `idols/krishna.jpg`

## Phase 2: Backend S3 URL Generation

### Backend Environment Variables
```env
AWS_S3_BUCKET=robohatch-product-images
AWS_S3_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Backend Code (Node.js/Express)
```javascript
// config/s3.js
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_S3_REGION;

function generateS3Url(imageKey) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${imageKey}`;
}

module.exports = { generateS3Url };
```

### API Route Example
```javascript
// routes/products.js
const { generateS3Url } = require('../config/s3');

router.get('/products', async (req, res) => {
  try {
    // Get products from database
    const products = await db.query('SELECT * FROM products');
    
    // Transform: Add imageUrl to each product
    const productsWithUrls = products.map(product => ({
      ...product,
      imageUrl: generateS3Url(product.image_key)
    }));
    
    res.json(productsWithUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
```

## Phase 3: Frontend Consumption

### Frontend API Call
```javascript
// lib/api.js
export async function getProducts(category = null) {
  const path = category 
    ? `/api/v1/products?category=${category}` 
    : '/api/v1/products';
  
  return await apiGet(path);
}
```

### Frontend Receives Complete Data
```json
{
  "id": 1,
  "name": "Krishna Idol",
  "price": 799,
  "description": "Lord Krishna with flute",
  "category": "devotional",
  "imageUrl": "https://robohatch-product-images.s3.eu-north-1.amazonaws.com/idols/krishna.jpg",
  "created_at": "2026-01-15T10:30:00Z"
}
```

### Frontend Usage
```javascript
// pages/products.js
import { getProducts } from '@/lib/api';
import Image from 'next/image';

export default function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <Image 
            src={product.imageUrl}  {/* ✅ Uses complete URL from backend */}
            alt={product.name}
            width={300}
            height={300}
          />
          <p>₹{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## Key Principles

### ✅ DO:
1. **Database**: Store only S3 keys (`idols/krishna.jpg`)
2. **Backend**: Generate full S3 URLs before sending to frontend
3. **Frontend**: Use `imageUrl` directly from API response
4. **Security**: Keep AWS credentials ONLY on backend (never expose to frontend)

### ❌ DON'T:
1. Store full URLs in database (hard to migrate buckets/regions)
2. Expose S3 config to frontend
3. Have frontend construct S3 URLs
4. Store AWS credentials in frontend code

## S3 Bucket Structure

```
robohatch-product-images/
├── idols/
│   ├── ganesha.jpg
│   ├── krishna.jpg
│   ├── buddha.jpg
│   └── lakshmi.jpg
├── keychains/
│   ├── custom-name.jpg
│   ├── logo.jpg
│   └── photo.jpg
├── superhero/
│   ├── ironman.jpg
│   ├── spiderman.jpg
│   └── batman.jpg
└── lamps/
    ├── geometric.jpg
    ├── moon.jpg
    └── star.jpg
```

## Migration Example

If you need to change buckets or regions:

```javascript
// OLD
const imageUrl = `https://old-bucket.s3.us-east-1.amazonaws.com/${image_key}`;

// NEW
const imageUrl = `https://new-bucket.s3.eu-north-1.amazonaws.com/${image_key}`;
```

**✅ Only backend code changes - no database migration needed!**

## Security Benefits

1. **No credential exposure**: AWS keys stay on backend
2. **Centralized control**: Change S3 config in one place
3. **Consistent URLs**: Backend ensures proper URL format
4. **Access control**: Backend can add auth checks before generating URLs
5. **CDN integration**: Easy to switch to CloudFront later

## Example API Response

### Request
```http
GET /api/v1/products?category=devotional
```

### Response
```json
[
  {
    "id": 1,
    "name": "Krishna Idol",
    "price": 799,
    "imageUrl": "https://robohatch-product-images.s3.eu-north-1.amazonaws.com/idols/krishna.jpg"
  },
  {
    "id": 2,
    "name": "Ganesha Idol",
    "price": 899,
    "imageUrl": "https://robohatch-product-images.s3.eu-north-1.amazonaws.com/idols/ganesha.jpg"
  }
]
```

**Frontend never touches S3 configuration!**
