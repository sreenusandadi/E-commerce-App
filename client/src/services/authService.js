import api from '@/utility/axiosInstance'

export const signUp = async (userData) => {
  const response = await api.post('/api/auth/register', userData)
  return response.data
}

export const signIn = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials)
  return response.data
}

export const refreshToken = async () => {
  const response = await api.post('/api/auth/refresh')
  return response.data
}

export const signOut = async () => {
  const response = await api.post('/api/auth/logout')
  return response.data
}
