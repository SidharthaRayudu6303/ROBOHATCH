import { USER_ROUTES, buildApiPath } from '../../../lib/apiRoutes'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://robohatch-backend-production.up.railway.app'

export default async function handler(req, res) {
  const backendUrl = `${API_BASE_URL}/api/v1/user/profile`

  try {
    // GET - Fetch user profile
    if (req.method === 'GET') {
      const response = await fetch(backendUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: data?.error || 'Failed to fetch profile' 
        })
      }

      return res.status(200).json(data)
    }

    // PUT - Update user profile
    if (req.method === 'PUT') {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
        },
        body: JSON.stringify(req.body),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: data?.error || 'Failed to update profile' 
        })
      }

      return res.status(200).json({
        success: true,
        data,
        message: 'Profile updated successfully'
      })
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('Profile API error:', err)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}
