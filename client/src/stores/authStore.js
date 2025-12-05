import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { refreshToken, signIn, signUp, signOut } from '@/services/authService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames.js'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const error = ref(null)
  const loading = ref(false)
  const token = ref(null)

  const router = useRouter()

  const registerUser = async (formData) => {
    loading.value = true
    error.value = null
    try {
      await signUp(formData)
      console.log(router)
      router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
    } catch (err) {
      if (err.response?.status === 400) {
        error.value = err.response.data.message
      } else {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const signInUser = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      const data = await signIn(credentials)
      token.value = data.accessToken
      isAuthenticated.value = true
      router.push({ name: APP_ROUTE_NAMES.HOME })
    } catch (err) {
      console.log(err)
      if (err.response?.status === 401 || err.response?.status === 404) {
        error.value = err.response.data.message
      } else {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const refreshAuth = async () => {
    loading.value = true
    error.value = null
    try {
      const authData = await refreshToken()
      token.value = authData.accessToken
      isAuthenticated.value = true
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        error.value = 'User should be signed in again, to access protected resources.'
      } else {
        error.value = err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const logoutUser = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut()
      isAuthenticated.value = false
      token.value = null
      error.value = null
      router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
    } catch (error) {
      console.log('Error during logout:', error)
      error.value = error.message
    }
  }

  return {
    user,
    isAuthenticated,
    error,
    loading,
    token,

    // actions
    registerUser,
    signInUser,
    refreshAuth,
    logoutUser,
  }
})
