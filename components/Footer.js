'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [notification, setNotification] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setNotification('Successfully subscribed to newsletter!')
      setEmail('')
    } else {
      setNotification('Please enter a valid email address')
    }
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <footer className="bg-dark-brown text-white py-12 sm:py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Image src="/logo.png" alt="ROBOHATCH Logo" width={35} height={35} className="sm:w-[40px] sm:h-[40px]" />
              <h3 className="text-xl sm:text-2xl font-bold text-primary-orange">ROBOHATCH</h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">Bringing your ideas to life through innovative 3D printing technology.</p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-orange transition-colors duration-300"><i className="fab fa-facebook"></i></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-orange transition-colors duration-300"><i className="fab fa-instagram"></i></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-orange transition-colors duration-300"><i className="fab fa-twitter"></i></Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-orange transition-colors duration-300"><i className="fab fa-pinterest"></i></Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#home" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Home</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Categories</Link></li>
              <li><Link href="#products" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Products</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">About Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Contact Us</Link></li>
              <li><Link href="/faqs" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">FAQs</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Shipping Info</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-orange transition-colors duration-300 text-sm">Returns</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">Stay updated with our latest products</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary-orange transition-colors duration-300"
              />
              <button type="submit" className="px-6 py-2 rounded-full font-semibold transition-all duration-300 bg-primary-orange text-white shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; 2026 ROBOHATCH. All rights reserved.</p>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-[slideUp_0.3s_ease-out] z-50">
          {notification}
        </div>
      )}
    </footer>
  )
}
