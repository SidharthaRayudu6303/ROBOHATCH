import apiClient from './apiClient'

const fetchProducts = async () => {
  try {
    const products = await apiClient.get('/products')
    return products
  } catch (error) {
    if (error.status === 401) {
    }
    throw error
  }
}

const createOrder = async (orderData) => {
  try {
    const order = await apiClient.post('/orders', orderData)
    return order
  } catch (error) {
    if (error.status === 500) {
    }
    throw error
  }
}

const updateProfile = async (userId, profileData) => {
  try {
    const profile = await apiClient.put(`/users/${userId}`, profileData)
    return profile
  } catch (error) {
    throw error
  }
}

const deleteItem = async (itemId) => {
  try {
    await apiClient.delete(`/items/${itemId}`)
  } catch (error) {
    throw error
  }
}

export { fetchProducts, createOrder, updateProfile, deleteItem }
