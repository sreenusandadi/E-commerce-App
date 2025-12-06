import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { signIn, signUp, signOut } from '@/services/authService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames.js'

export const defaultUser = {
  id: '',
  email: '',
  role: '',
}

export const useAuthStore = defineStore('authStore', () => {
  const isAuthenticated = ref(false)
  const error = ref(null)
  const loading = ref(false)
  const token = ref(null)

  const user = reactive(defaultUser)

  const router = useRouter()

  const isAuthenticatedCheck = computed(() => isAuthenticated.value)

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
      Object.assign(user, data.user)
      isAuthenticated.value = true
      console.log(router)
      router.push({ name: APP_ROUTE_NAMES.HOME })
    } catch (err) {
      isAuthenticated.value = false
      token.value = null
      Object.assign(user, defaultUser)
      if (err.response?.status === 401 || err.response?.status === 404) {
        error.value = err.response.data.message
      } else {
        error.value = err.message
      }
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
      Object.assign(user, defaultUser)
      router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
    } catch (error) {
      console.log('Error during logout:', error)
      error.value = error.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    error,
    loading,
    token,

    // Getters
    isAuthenticatedCheck,

    // actions
    registerUser,
    signInUser,
    logoutUser,
  }
})
