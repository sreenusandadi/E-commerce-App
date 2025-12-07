import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router/routes'
import api from './utility/axiosInstance'
import { useAuthStore } from './stores/authStore'
import { defaultUser } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

const themeStore = useThemeStore()
if (themeStore.defaultTheme) {
  document.body.setAttribute('data-bs-theme', themeStore.defaultTheme)
}

async function initApp() {
  const authStore = useAuthStore()

  try {
    const { data } = await api.post('/api/auth/refresh')
    authStore.token = data.accessToken
    authStore.isAuthenticated = true
    Object.assign(authStore.user, data.user)
  } catch (error) {
    console.log(error)
    authStore.token = null
    authStore.isAuthenticated = false
    Object.assign(authStore.user, defaultUser)
  }
  app.use(router)
  app.mount('#app')
}

initApp()
