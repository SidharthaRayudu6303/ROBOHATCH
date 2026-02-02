/**
 * Example: Fetching Products from Backend API
 * This demonstrates the correct pattern for using S3 image URLs
 */

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import Image from 'next/image';

export default function ProductList({ category = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // ✅ Fetch products from backend
        // Backend returns products with imageUrl already generated from S3
        const data = await getProducts(category);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-orange"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* ✅ Use imageUrl directly from backend response */}
          {/* Backend has already generated: https://bucket.s3.region.amazonaws.com/key */}
          {product.imageUrl ? (
            <div className="aspect-square rounded-lg overflow-hidden mb-3">
              <Image
                src={product.imageUrl} // ✅ Complete S3 URL from backend
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-4xl mb-3">
              <i className={`fas ${product.icon || 'fa-box'}`}></i>
            </div>
          )}

          <h3 className="font-bold text-dark-brown mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-orange">
              ₹{product.price}
            </span>
            <button className="w-10 h-10 bg-primary-orange text-white rounded-full flex items-center justify-center hover:bg-hover-orange transition-all">
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * BACKEND RESPONSE EXAMPLE:
 * 
 * [
 *   {
 *     "id": 1,
 *     "name": "Krishna Idol",
 *     "price": 799,
 *     "description": "Lord Krishna with flute",
 *     "category": "devotional",
 *     "imageUrl": "https://robohatch-product-images.s3.eu-north-1.amazonaws.com/idols/krishna.jpg"
 *   },
 *   {
 *     "id": 2,
 *     "name": "Ganesha Idol",
 *     "price": 899,
 *     "description": "Lord Ganesha blessing idol",
 *     "category": "devotional",
 *     "imageUrl": "https://robohatch-product-images.s3.eu-north-1.amazonaws.com/idols/ganesha.jpg"
 *   }
 * ]
 * 
 * ✅ Frontend receives complete imageUrl
 * ✅ No S3 configuration needed on frontend
 * ✅ Just use product.imageUrl directly
 */

/**
 * USAGE EXAMPLES:
 * 
 * // Fetch all products
 * <ProductList />
 * 
 * // Fetch products by category
 * <ProductList category="devotional" />
 * <ProductList category="keychains" />
 */
