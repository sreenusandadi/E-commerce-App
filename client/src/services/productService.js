import api from '@/utility/axiosInstance'

export const addProduct = async (product) => {
  const response = await api.post('/api/products', product)
  return response.data
}

export const getProducts = async () => {
  const response = await api.get('/api/products')
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`)
  return response.data
}

export const updateProduct = async (id, product) => {
  const response = await api.put(`/api/products/${id}`, product)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`)
  return response.data
}

export const imageUpload = async (formData) => {
  const response = await api.post('/api/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
