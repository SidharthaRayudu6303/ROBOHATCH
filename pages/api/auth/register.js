import { AUTH_ROUTES, buildApiPath } from '../../../lib/apiRoutes'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://robohatch-backend-production.up.railway.app'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { email, password, name, phone } = req.body || {}
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const backendUrl = `${process.env.BACKEND_BASE_URL}/api/v1/auth/register`
    console.log('Registering user at:', backendUrl)
    console.log('Request body:', { email, password: '***', ...(name && { name }) })

    // Send only email and password to match backend expectation
    const requestBody = { email, password }
    if (name) {
      requestBody.name = name
    }
    if (phone) {
      requestBody.phone = phone
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json().catch(() => ({}))
    console.log('Backend response status:', response.status)
    console.log('Backend response data:', data)

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error || data?.message || 'Registration failed' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ error: 'Unexpected server error: ' + err.message })
  }
}
