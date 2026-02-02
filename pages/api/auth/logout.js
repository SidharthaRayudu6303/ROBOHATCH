import { AUTH_ROUTES, buildApiPath } from '../../../lib/apiRoutes'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://robohatch-backend-production.up.railway.app'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const backendUrl = `${API_BASE_URL}/api/v1/auth/logout`

    const response = await fetch(backendUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from client request
        'Cookie': req.headers.cookie || '',
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Logout failed' 
      })
    }

    // Clear cookies on client side
    res.setHeader('Set-Cookie', [
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
      'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
    ])

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (err) {
    console.error('Logout error:', err)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}
