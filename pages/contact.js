import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [notification, setNotification] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    // Basic XSS prevention - sanitize input
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setNotification('Please enter a valid email address.')
      setTimeout(() => setNotification(''), 5000)
      return
    }
    
    // Validate phone number if provided
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      setNotification('Please enter a valid phone number.')
      setTimeout(() => setNotification(''), 5000)
      return
    }
    
    if (formData.name && formData.email && formData.message) {
      setNotification('Thank you for contacting us! We will get back to you within 24 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } else {
      setNotification('Please fill in all required fields.')
    }
    
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <>
      <Head>
        <title>Contact Us - ROBOHATCH</title>
        <meta name="description" content="Get in touch with ROBOHATCH for all your 3D printing needs" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen pt-[120px] pb-20 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-orange-100/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl text-[#2c3e50] mb-5 font-bold">Get In Touch</h1>
            <p className="text-xl text-[#666] max-w-2xl mx-auto">Have a question or want to work together? We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 mb-16">
            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(255,94,77,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-[#ff3b29] rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-map-marker-alt text-2xl text-white"></i>
                </div>
                <h3 className="text-xl text-[#2c3e50] mb-4 font-semibold">Visit Us</h3>
                <p className="text-[#666] leading-[1.8]">123 Innovation Street<br/>Tech Park, Building 5<br/>Silicon Valley, CA 94025</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(255,94,77,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-[#ff3b29] rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-phone text-2xl text-white"></i>
                </div>
                <h3 className="text-xl text-[#2c3e50] mb-4 font-semibold">Call Us</h3>
                <p className="text-[#666] leading-[1.8]">+1 (555) 123-4567<br/>Mon-Fri: 9AM - 6PM PST<br/>Sat: 10AM - 4PM PST</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(255,94,77,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-[#ff3b29] rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-envelope text-2xl text-white"></i>
                </div>
                <h3 className="text-xl text-[#2c3e50] mb-4 font-semibold">Email Us</h3>
                <p className="text-[#666] leading-[1.8]">info@robohatch.com<br/>support@robohatch.com<br/>sales@robohatch.com</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(255,94,77,0.2)]">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-[#ff3b29] rounded-full flex items-center justify-center mb-5">
                  <i className="fas fa-clock text-2xl text-white"></i>
                </div>
                <h3 className="text-xl text-[#2c3e50] mb-4 font-semibold">Business Hours</h3>
                <p className="text-[#666] leading-[1.8]">Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 4:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
              <h2 className="text-3xl text-[#2c3e50] mb-8 font-semibold">Send Us a Message</h2>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-[#2c3e50] mb-2 font-medium">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-[#2c3e50] mb-2 font-medium">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-[#2c3e50] mb-2 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="subject" className="text-[#2c3e50] mb-2 font-medium">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-all focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="text-[#2c3e50] mb-2 font-medium">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or question..."
                    rows="6"
                    required
                    className="px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-all resize-y min-h-[120px] focus:outline-none focus:border-primary-orange focus:shadow-[0_0_0_3px_rgba(255,94,77,0.1)]"
                  ></textarea>
                </div>

                <button type="submit" className="bg-gradient-to-br from-primary-orange to-[#ff3b29] text-white border-none px-10 py-4 text-lg rounded-[30px] cursor-pointer transition-all font-semibold flex items-center justify-center gap-2.5 self-start hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(255,94,77,0.4)]">
                  Send Message
                  <i className="fas fa-paper-plane text-base"></i>
                </button>
              </form>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl text-[#2c3e50] mb-8 font-semibold">Find Us Here</h2>
            <div className="bg-white p-20 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-5">
              <i className="fas fa-map-marked-alt text-6xl text-primary-orange"></i>
              <p className="text-xl text-[#666]">Interactive Map</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {notification && (
        <div className={`fixed bottom-8 right-8 px-8 py-5 rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.2)] z-[1000] animate-[slideIn_0.3s_ease] font-medium ${
          notification.includes('Thank you') ? 'bg-[#4caf50] text-white' : 'bg-[#f44336] text-white'
        }`}>
          {notification}
        </div>
      )}
    </>
  )
}