const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { email, password } = req.body || {}
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const backendUrl = `${API_BASE_URL}/api/v1/auth/login`

    const response = await fetch(backendUrl, {
      method: 'POST',
      credentials: 'include', // Forward cookies from backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data?.error || data?.message || 'Login failed' 
      })
    }

    // Forward Set-Cookie headers from backend to client
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader)
    }

    return res.status(200).json({
      success: true,
      user: data.user || data.data,
      message: 'Login successful'
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}
