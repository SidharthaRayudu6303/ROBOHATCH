'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Head from 'next/head'
import { apiGet, addToCart as apiAddToCart } from '../../../lib/api'

export default function ProductCategoryItem() {
  const router = useRouter()
  const { category, item } = router.query
  const [products, setProducts] = useState([])
  const [notification, setNotification] = useState('')
  const [itemName, setItemName] = useState('')

  useEffect(() => {
    if (category && item) {
      loadProducts()
    }
  }, [category, item])

  const loadProducts = async () => {
    try {
      // Handle undefined category by trying to find the category from the item
      let actualCategory = category
      
      // If category is undefined, try to infer it from common item names
      if (!category || category === 'undefined') {
        if (item && item.includes('keychain')) {
          actualCategory = 'keychains'
        } else if (item && item.includes('superhero')) {
          actualCategory = 'superhero'
        }
      }
      
      // Get all products from backend
      const response = await apiGet(`/products?category=${actualCategory}&limit=100`)
      const categoryProducts = response.products || []
      
      // Convert URL slug back to readable name
      const readableItemName = item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      setItemName(readableItemName)
      
      // Filter products related to the item name
      let relatedProducts = []
      
      // Convert item name to lowercase for matching
      const itemLower = item.toLowerCase()
      
      // Find products that match the item name
      relatedProducts = categoryProducts.filter(product => {
        const productNameLower = product.name.toLowerCase()
        const productDescLower = product.description.toLowerCase()
        
        // Check if product name or description contains any word from the item
        return itemLower.split('-').some(word => 
          productNameLower.includes(word) || productDescLower.includes(word)
        )
      })
      
      // If no exact matches found, show first 4 products from category
      if (relatedProducts.length === 0) {
        relatedProducts = categoryProducts.slice(0, 4)
      }
      
      setProducts(relatedProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts([])
    }
  }

  const addToCart = async (product) => {
    try {
      await apiAddToCart(product.id, 1)
      setNotification(`${product.name} added to cart!`)
      setTimeout(() => setNotification(''), 3000)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setNotification('Please login to add items to cart')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  if (!category || !item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-primary-orange mb-4"></i>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{itemName} - ROBOHATCH</title>
        <meta name="description" content={`Explore ${itemName} in our ${category} category`} />
      </Head>

      <Navbar />
      
      <div className="min-h-screen pt-20 bg-light-gray">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-orange to-hover-orange py-16 mb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Categories
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{itemName}</h1>
              <p className="text-xl text-white/90 capitalize">Related products from {category.replace(/-/g, ' ')}</p>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="container mx-auto px-4 pb-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-soft-peach to-primary-orange p-8 flex items-center justify-center cursor-pointer">
                      <i className={`fas ${product.icon} text-6xl text-white`}></i>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-dark-brown mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                      <p className="text-2xl font-bold text-primary-orange">₹{product.price}</p>
                    </div>
                  </Link>
                  <button 
                    className="w-full px-4 py-3 bg-gradient-to-br from-primary-orange to-hover-orange text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => addToCart(product)}
                  >
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-xl text-gray-600">No products found in this category</p>
              <Link href="/categories" className="inline-block mt-6 px-6 py-3 bg-primary-orange text-white rounded-full font-semibold hover:bg-hover-orange transition-colors">
                Browse All Categories
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg z-50 animate-slideInRight">
          <i className="fas fa-check-circle mr-2"></i>
          {notification}
        </div>
      )}
      
      <Footer />
    </>
  )
}
