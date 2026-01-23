export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { email } = req.body || {}
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const backendUrl = `${process.env.BACKEND_BASE_URL}/api/v1/auth/forgot-password`
    console.log('Forgot password request to:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json().catch(() => ({}))
    console.log('Forgot password response status:', response.status)

    if (!response.ok) {
      console.log('Forgot password failed:', data)
      return res.status(response.status).json({ error: data?.error || data?.message || 'Failed to send reset email' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(500).json({ error: 'Unexpected server error: ' + err.message })
  }
}
