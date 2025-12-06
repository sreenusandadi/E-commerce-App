import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore(
  'themeStore',
  () => {
    const defaultTheme = ref('dark')

    const setTheme = (theme) => {
      defaultTheme.value = theme
      document.body.setAttribute('data-bs-theme', theme)
    }
    return { defaultTheme, setTheme }
  },
  { persist: true },
)
