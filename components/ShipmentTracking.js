import { useState, useEffect } from 'react'
import { apiGet } from '../lib/api'
import { SHIPMENT_ROUTES, buildApiPath } from '../lib/apiRoutes'

const SHIPMENT_STATUSES = [
  { key: 'PENDING', label: 'Pending', icon: 'fa-clock' },
  { key: 'PROCESSING', label: 'Processing', icon: 'fa-cog' },
  { key: 'SHIPPED', label: 'Shipped', icon: 'fa-truck' },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: 'fa-route' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'fa-shipping-fast' },
  { key: 'DELIVERED', label: 'Delivered', icon: 'fa-check-circle' },
]

export default function ShipmentTracking({ orderId }) {
  const [shipment, setShipment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orderId) {
      fetchShipmentInfo()
    }
  }, [orderId])

  const fetchShipmentInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // ✅ v1.0.0: GET /orders/:orderId/shipment
      const data = await apiGet(buildApiPath(SHIPMENT_ROUTES.GET_ORDER_SHIPMENT(orderId)))
      setShipment(data)
    } catch (err) {
      // 404 is expected if shipment doesn't exist yet
      if (err.statusCode === 404) {
        setShipment(null)
      } else {
        setError(err.message || 'Failed to load shipment information')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase()
    switch (statusUpper) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'IN_TRANSIT':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCurrentStatusIndex = () => {
    if (!shipment?.status) return 0
    const index = SHIPMENT_STATUSES.findIndex(s => s.key === shipment.status.toUpperCase())
    return index >= 0 ? index : 0
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-orange"></div>
          <span className="ml-3 text-gray-600">Loading shipment info...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
          <i className="fas fa-exclamation-circle text-xl"></i>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-dark-brown mb-4">
          <i className="fas fa-shipping-fast text-primary-orange mr-2"></i>
          Shipment Tracking
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-box-open text-3xl text-gray-400"></i>
          </div>
          <p className="text-gray-600 font-medium">No shipment information yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Tracking details will appear here once your order is shipped
          </p>
        </div>
      </div>
    )
  }

  const currentIndex = getCurrentStatusIndex()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-brown mb-6">
        <i className="fas fa-shipping-fast text-primary-orange mr-2"></i>
        Shipment Tracking
      </h2>

      <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Courier</p>
            <p className="font-semibold text-gray-900">{shipment.courierName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="font-semibold text-gray-900 font-mono">{shipment.trackingNumber || 'N/A'}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Current Status</p>
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(shipment.status)}`}>
            {SHIPMENT_STATUSES.find(s => s.key === shipment.status?.toUpperCase())?.label || shipment.status}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-5 top-6 w-0.5 bg-primary-orange transition-all duration-500"
          style={{ 
            height: `${(currentIndex / (SHIPMENT_STATUSES.length - 1)) * 100}%` 
          }}
        ></div>

        <div className="space-y-4">
          {SHIPMENT_STATUSES.map((status, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex

            return (
              <div key={status.key} className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary-orange text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <i className={`fas ${status.icon} ${isCurrent ? 'animate-pulse' : ''}`}></i>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`font-semibold ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {status.label}
                  </h3>
                  {isCurrent && shipment.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(shipment.lastUpdated).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {shipment.trackingUrl && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-orange hover:text-hover-orange font-semibold"
          >
            <i className="fas fa-external-link-alt"></i>
            Track on courier website
          </a>
        </div>
      )}
    </div>
  )
}
