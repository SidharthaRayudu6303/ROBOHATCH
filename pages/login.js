'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { setAuthToken } from '../utils/api'

export default function Login() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' })
  const [loginError, setLoginError] = useState('')

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' }
    
    let score = 0
    
    if (pass.length >= 8) score += 20
    if (pass.length >= 12) score += 10
    if (pass.length >= 16) score += 10
    
    if (/[a-z]/.test(pass)) score += 15
    if (/[A-Z]/.test(pass)) score += 15
    if (/[0-9]/.test(pass)) score += 15
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 15
    
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 5
    if (/[0-9]/.test(pass) && /[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 5
    
    let label = ''
    let color = ''
    
    if (score < 40) {
      label = 'Weak'
      color = '#d32f2f'
    } else if (score < 70) {
      label = 'Medium'
      color = '#ff9800'
    } else {
      label = 'Strong'
      color = '#4caf50'
    }
    
    return { score, label, color }
  }

  const validatePassword = (pass) => {
    const errors = []
    if (pass.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter')
    if (!/[a-z]/.test(pass)) errors.push('One lowercase letter')
    if (!/[0-9]/.test(pass)) errors.push('One number')
    if (!/[!@#$%^&*]/.test(pass)) errors.push('One special character (!@#$%^&*)')
    setPasswordErrors(errors)
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (isSignUp) {
      validatePassword(newPassword)
      setPasswordStrength(calculatePasswordStrength(newPassword))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoginError('')

    // Sanitize inputs to prevent XSS
    const sanitizedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(sanitizedEmail)) {
      setLoginError('Please enter a valid email address')
      return
    }

    // Check for common injection patterns
    const dangerousPatterns = /<script|javascript:|onerror=|onclick=/gi
    if (dangerousPatterns.test(email) || dangerousPatterns.test(name)) {
      setLoginError('Invalid characters detected')
      return
    }

    if (!isSignUp) {
      // Sign In: call API proxy
      ;(async () => {
        try {
          const resp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sanitizedEmail, password }),
          })

          const data = await resp.json()

          if (!resp.ok) {
            setLoginError(data?.error || 'Invalid email or password')
            return
          }

          // Store token if present; adjust key based on backend response
          const token = data?.accessToken || data?.token || data?.data?.token || data?.access_token
          if (token) {
            setAuthToken(token)
            console.log('Token stored successfully')
          } else {
            console.warn('No token found in response:', data)
          }

          // Save basic user data if available from response
          const userData = data?.user || data?.data?.user || {}
          const userProfile = {
            name: (userData.name || sanitizedEmail.split('@')[0]).substring(0, 100), // Limit length
            email: (userData.email || sanitizedEmail).substring(0, 100),
            phone: (userData.phone || '').substring(0, 20),
            address: (userData.address || '').substring(0, 200),
            city: (userData.city || '').substring(0, 100),
            state: (userData.state || '').substring(0, 100),
            pincode: (userData.pincode || '').substring(0, 10)
          }
          localStorage.setItem('userProfile', JSON.stringify(userProfile))

          // Trigger auth state change
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('authChanged'))
          }

          // Check if user is admin and redirect accordingly
          if (sanitizedEmail === 'admin@robohatch.com') {
            router.push('/admin')
          } else {
            router.push('/')
          }
        } catch (error) {
          setLoginError('Unable to reach login service')
        }
      })()
    } else {
      // Sign Up: call register API
      if (password !== confirmPassword) {
        setLoginError('Passwords do not match')
        return
      }
      if (passwordErrors.length > 0) {
        setLoginError('Please fix password requirements')
        return
      }
      ;(async () => {
        try {
          console.log('Sending registration request with:', { name, email: sanitizedEmail, password: '***' })
          const resp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.substring(0, 100), email: sanitizedEmail, password }),
          })

          const data = await resp.json()
          console.log('Registration response:', data)

          if (!resp.ok) {
            setLoginError(data?.error || 'Registration failed')
            return
          }

          // Registration successful, store token if present and redirect
          const token = data?.accessToken || data?.token || data?.data?.token || data?.access_token
          if (token) {
            setAuthToken(token)
            console.log('Registration token stored successfully')
          } else {
            console.warn('No token found in registration response:', data)
          }

          // Save user profile data from signup form or backend response
          const userData = data?.user || data?.data?.user || {}
          const userProfile = {
            name: (name || userData.name || email.split('@')[0]).substring(0, 100),
            email: (sanitizedEmail || userData.email || '').substring(0, 100),
            phone: (userData.phone || '').substring(0, 20),
            address: (userData.address || '').substring(0, 200),
            city: (userData.city || '').substring(0, 100),
            state: (userData.state || '').substring(0, 100),
            pincode: (userData.pincode || '').substring(0, 10)
          }
          localStorage.setItem('userProfile', JSON.stringify(userProfile))
          console.log('User profile saved:', userProfile)

          // Trigger auth state change
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('authChanged'))
          }

          // Redirect to home page
          router.push('/')
        } catch (error) {
          console.error('Registration error:', error)
          setLoginError('Unable to reach registration service')
        }
      })()
    }
  }

  return (
    <>
      <Navbar hideLogin={true} hideMenu={true} hideCart={true} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/70 via-amber-50/50 to-orange-100/40 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-10 animate-[slideUp_0.5s_ease-out]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-[#666]">{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</p>
            </div>

            <div className="flex rounded-[12px] bg-[#f0f0f0] p-1 mb-8">
              <button 
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${!isSignUp ? 'bg-white text-primary-orange shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'text-[#666]'}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${isSignUp ? 'bg-white text-primary-orange shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'text-[#666]'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {loginError && (
                <div className="bg-[#fee] border border-[#fcc] text-[#c33] px-4 py-3 rounded-lg flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  {loginError}
                </div>
              )}
              {isSignUp && (
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[#2c3e50] mb-2 font-medium text-sm">Full Name (Optional)</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-border-color rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
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
                  className="w-full px-4 py-3.5 border-2 border-border-color rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="text-[#2c3e50] mb-2 font-medium text-sm">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3.5 pr-12 border-2 border-border-color rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-primary-orange transition-colors bg-transparent border-none cursor-pointer p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {isSignUp && password && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                {isSignUp && passwordErrors.length > 0 && (
                  <div className="mt-3 bg-[#fff5f5] border border-[#ffdddd] rounded-lg p-3">
                    <p className="text-sm font-medium text-[#d32f2f] mb-2">Password must contain:</p>
                    <ul className="text-sm space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="text-[#d32f2f] flex items-center gap-2">
                          <i className="fas fa-times-circle text-xs"></i>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="flex flex-col">
                  <label htmlFor="confirm-password" className="text-[#2c3e50] mb-2 font-medium text-sm">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password" 
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 pr-12 border-2 border-border-color rounded-lg transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-primary-orange transition-colors bg-transparent border-none cursor-pointer p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${password === confirmPassword ? 'text-[#4caf50]' : 'text-[#d32f2f]'}`}>
                      <i className={`fas ${password === confirmPassword ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      <span>{password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</span>
                    </div>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary-orange" />
                    <span className="text-sm text-[#666]">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-orange hover:underline">Forgot Password?</Link>
                </div>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-primary-orange to-[#ff3b29] text-white py-4 rounded-[12px] font-semibold text-base transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,94,77,0.3)] mt-2">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative text-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e0e0e0]"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-[#999]">Or continue with</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 bg-white border-2 border-[#e0e0e0] text-[#555] py-3 px-4 rounded-lg font-medium transition-all hover:border-primary-orange hover:text-primary-orange hover:-translate-y-0.5">
                  <i className="fab fa-google text-lg"></i>
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 bg-white border-2 border-[#e0e0e0] text-[#555] py-3 px-4 rounded-lg font-medium transition-all hover:border-primary-orange hover:text-primary-orange hover:-translate-y-0.5">
                  <i className="fab fa-facebook-f text-lg"></i>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}