import { useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'

export default function CreateShipmentForm({ orderId, onSuccess }) {
  const [formData, setFormData] = useState({
    orderId: orderId || '',
    courierName: '',
    trackingNumber: '',
    trackingUrl: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/admin/shipments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to create shipment')
      }

      const data = await response.json()
      setSuccess(true)
      
      setFormData({
        orderId: '',
        courierName: '',
        trackingNumber: '',
        trackingUrl: '',
      })

      if (onSuccess) {
        onSuccess(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to create shipment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-brown mb-6">
        <i className="fas fa-plus-circle text-primary-orange mr-2"></i>
        Create Shipment
      </h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <i className="fas fa-check-circle text-xl"></i>
          <p className="font-medium">Shipment created successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
          <i className="fas fa-exclamation-circle text-xl"></i>
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700 mb-2">
            Order ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            disabled={!!orderId}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter order ID"
          />
        </div>

        <div>
          <label htmlFor="courierName" className="block text-sm font-semibold text-gray-700 mb-2">
            Courier Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="courierName"
            name="courierName"
            value={formData.courierName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
            placeholder="e.g., FedEx, DHL, Blue Dart"
          />
        </div>

        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Tracking Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="trackingNumber"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all font-mono"
            placeholder="Enter tracking number"
          />
        </div>

        <div>
          <label htmlFor="trackingUrl" className="block text-sm font-semibold text-gray-700 mb-2">
            Tracking URL
          </label>
          <input
            type="url"
            id="trackingUrl"
            name="trackingUrl"
            value={formData.trackingUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
            placeholder="https://courier.com/track/..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-hover-orange transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <i className="fas fa-check"></i>
              <span>Create Shipment</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
