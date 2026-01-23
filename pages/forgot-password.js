'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await resp.json()

      if (!resp.ok) {
        setError(data?.error || 'Failed to send reset email')
        setIsLoading(false)
        return
      }

      setMessage('Password reset link has been sent to your email')
      setEmail('')
      setIsLoading(false)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError('Unable to process request. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar hideLogin={true} hideMenu={true} hideCart={true} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/70 via-amber-50/50 to-orange-100/40 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-10 animate-[slideUp_0.5s_ease-out]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-hover-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-lock text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-2">Forgot Password?</h2>
              <p className="text-[#666]">Enter your email to receive a reset link</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-[#fee] border border-[#fcc] text-[#c33] px-4 py-3 rounded-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              
              {message && (
                <div className="bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] px-4 py-3 rounded-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
                  <i className="fas fa-check-circle"></i>
                  {message}
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="email" className="text-[#2c3e50] mb-2 font-medium text-sm">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 border-2 border-border-color rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-orange to-[#ff3b29] text-white py-4 rounded-[12px] font-semibold text-base transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,94,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary-orange hover:underline font-medium flex items-center justify-center gap-2">
                <i className="fas fa-arrow-left"></i>
                Back to Login
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e0e0e0] text-center">
              <p className="text-sm text-[#666]">
                Don't have an account?{' '}
                <Link href="/login" className="text-primary-orange hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
