import { useState } from 'react'
// ⚠️ ADMIN COMPONENT - DISABLED (OPTION B)
// This component is not currently in use as admin panel is disabled

const STATUS_FLOW = {
  'PENDING': ['PROCESSING'],
  'PROCESSING': ['SHIPPED'],
  'SHIPPED': ['IN_TRANSIT'],
  'IN_TRANSIT': ['OUT_FOR_DELIVERY'],
  'OUT_FOR_DELIVERY': ['DELIVERED'],
  'DELIVERED': [],
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', icon: 'fa-clock', color: 'yellow' },
  { value: 'PROCESSING', label: 'Processing', icon: 'fa-cog', color: 'blue' },
  { value: 'SHIPPED', label: 'Shipped', icon: 'fa-truck', color: 'purple' },
  { value: 'IN_TRANSIT', label: 'In Transit', icon: 'fa-route', color: 'indigo' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'fa-shipping-fast', color: 'orange' },
  { value: 'DELIVERED', label: 'Delivered', icon: 'fa-check-circle', color: 'green' },
]

export default function ShipmentStatusUpdate({ shipmentId, currentStatus, onSuccess }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const allowedStatuses = STATUS_FLOW[currentStatus] || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedStatus) {
      setError('Please select a status')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${API_BASE_URL}/admin/shipments/${shipmentId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update shipment status')
      }

      const data = await response.json()
      setSuccess(true)
      setSelectedStatus('')

      if (onSuccess) {
        onSuccess(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to update shipment status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (colorName) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200',
      green: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      gray: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
    }
    return colors[colorName] || colors.gray
  }

  const getCurrentStatusOption = STATUS_OPTIONS.find(s => s.value === currentStatus)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-brown mb-6">
        <i className="fas fa-sync-alt text-primary-orange mr-2"></i>
        Update Shipment Status
      </h2>

      <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Current Status</p>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(getCurrentStatusOption?.color)}`}>
            <i className={`fas ${getCurrentStatusOption?.icon} mr-2`}></i>
            {getCurrentStatusOption?.label || currentStatus}
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <i className="fas fa-check-circle text-xl"></i>
          <p className="font-medium">Status updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
          <i className="fas fa-exclamation-circle text-xl"></i>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {allowedStatuses.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <i className="fas fa-info-circle text-3xl text-gray-400 mb-3"></i>
          <p className="text-gray-600 font-medium">No further status updates available</p>
          <p className="text-sm text-gray-500 mt-2">
            {currentStatus === 'DELIVERED' ? 'This shipment has been delivered.' : 'This status cannot be changed.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Next Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((status) => {
                const isAllowed = allowedStatuses.includes(status.value)
                const isSelected = selectedStatus === status.value

                return (
                  <button
                    key={status.value}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => {
                      if (isAllowed) {
                        setSelectedStatus(status.value)
                        setError(null)
                        setSuccess(false)
                      }
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary-orange bg-orange-50 shadow-md'
                        : isAllowed
                        ? getStatusColor(status.color) + ' border'
                        : getStatusColor('gray') + ' border opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fas ${status.icon} text-xl`}></i>
                      <div>
                        <p className="font-semibold">{status.label}</p>
                        {!isAllowed && (
                          <p className="text-xs mt-1">Not available</p>
                        )}
                      </div>
                      {isSelected && (
                        <i className="fas fa-check-circle ml-auto text-primary-orange"></i>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedStatus}
            className="w-full bg-primary-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-hover-orange transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>Update Status</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
