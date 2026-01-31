import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../utils/apiClient'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check authentication
        if (!apiClient.isAuthenticated()) {
          router.push('/login')
          return
        }

        setIsLoading(true)
        
        // Fetch user profile from backend
        const userData = await apiClient.get('/auth/profile')
        setUser(userData?.data || userData)

        // Note: Orders will be fetched from backend in future phase
        // For now, keep localStorage as fallback
        const savedOrders = localStorage.getItem('orderHistory')
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders))
        }
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Unauthorized')) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleSave = async () => {
    try {
      // Update profile on backend (when endpoint is available)
      // await apiClient.put('/auth/profile', user)
      
      // For now, save to localStorage as fallback
      localStorage.setItem('userProfile', JSON.stringify(user))
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Failed to update profile: ' + err.message)
    }
  }

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value })
  }

  const handleLogout = () => {
    apiClient.removeToken()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-orange"></i>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-xl text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>My Profile - ROBOHATCH</title>
        <meta name="description" content="Manage your ROBOHATCH profile and view order history" />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-8 sm:py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown mb-2 sm:mb-3">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your account information and view order history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-brown mb-1 sm:mb-2">
                      {user.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{user.email}</p>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="bg-gradient-to-r from-primary-orange to-hover-orange text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg active:scale-95"
                    >
                      <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'} mr-2`}></i>
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={user.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your city"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={user.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full address"
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed resize-none text-sm sm:text-base"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={user.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        disabled={!isEditing}
                        placeholder="State"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        value={user.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Pincode"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary-orange focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-primary-orange to-hover-orange rounded-2xl shadow-lg p-5 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Account Stats</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <i className="fas fa-shopping-bag text-lg sm:text-xl"></i>
                      <span className="text-sm sm:text-base">Total Orders</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <i className="fas fa-heart text-lg sm:text-xl"></i>
                      <span className="text-sm sm:text-base">Wishlist</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <i className="fas fa-star text-lg sm:text-xl"></i>
                      <span className="text-sm sm:text-base">Reviews</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold">0</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-dark-brown mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/my-orders" className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group">
                    <i className="fas fa-box text-primary-orange text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary-orange">My Orders</span>
                  </a>
                  <a href="/cancelled-orders" className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group">
                    <i className="fas fa-times-circle text-red-600 text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-red-600">Cancelled Orders</span>
                  </a>
                  <a href="/cart" className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group">
                    <i className="fas fa-shopping-cart text-primary-orange text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary-orange">View Cart</span>
                  </a>
                  <a href="/#products" className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group">
                    <i className="fas fa-shopping-bag text-primary-orange text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary-orange">Browse Products</span>
                  </a>
                  <a href="/contact" className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group">
                    <i className="fas fa-headset text-primary-orange text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary-orange">Contact Support</span>
                  </a>
                  <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group w-full">
                    <i className="fas fa-sign-out-alt text-red-600 text-lg"></i>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-red-600">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-6 sm:mt-8 md:mt-10">
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-brown mb-4 sm:mb-6">Order History</h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div key={index} className="border-2 border-gray-100 rounded-xl p-4 sm:p-5 hover:border-primary-orange transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                        <div>
                          <h4 className="font-semibold text-base sm:text-lg text-dark-brown">Order #{order.id}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{order.date}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-700 w-fit">
                            {order.status}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-primary-orange">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <i className="fas fa-shopping-bag text-5xl sm:text-6xl text-gray-300 mb-4"></i>
                  <p className="text-base sm:text-lg text-gray-600 mb-4">No orders yet</p>
                  <a href="/#products" className="inline-block bg-gradient-to-r from-primary-orange to-hover-orange text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg active:scale-95">
                    Start Shopping
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
