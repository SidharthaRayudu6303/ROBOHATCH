'use client'
import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Head from 'next/head'

export default function WonderWoman() {
  const [notification, setNotification] = useState('')
  
  const products = [
    { id: 'ww1', name: 'Wonder Woman 1984', price: 1299, icon: 'fa-female', description: 'Golden armor Wonder Woman', image: '/products/ww-1984.jpg' },
    { id: 'ww2', name: 'Wonder Woman Classic', price: 1249, icon: 'fa-star', description: 'Classic Amazonian warrior', image: '/products/ww-classic.jpg' },
    { id: 'ww3', name: 'Wonder Woman Justice League', price: 1299, icon: 'fa-sword', description: 'Justice League movie version', image: '/products/ww-jl.jpg' }
  ]

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = cart.findIndex(item => item.id === product.id)
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(''), 3000)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <>
      <Head>
        <title>Wonder Woman Figures | ROBOHATCH</title>
        <meta name="description" content="Amazonian warrior princess figures" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen pt-20 bg-light-gray">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-brown mb-4">
              <i className="fas fa-female mr-3"></i> Wonder Woman
            </h1>
            <p className="text-lg text-gray-600">Amazonian warrior princess figures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-soft-peach to-primary-orange p-8 flex items-center justify-center">
                  <i className={`fas ${product.icon} text-6xl text-white`}></i>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark-brown mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-orange">₹{product.price}</span>
                    <button 
                      className="px-6 py-3 bg-gradient-to-br from-primary-orange to-hover-orange text-white rounded-full font-semibold shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] transition-all duration-300 flex items-center gap-2"
                      onClick={() => addToCart(product)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {notification && (
        <div className="fixed bottom-8 right-8 px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-3 animate-slideInRight z-50">
          <i className="fas fa-check-circle text-xl"></i>
          {notification}
        </div>
      )}
      
      <Footer />
    </>
  )
}
