export const useThemeStore = () => {
  const setTheme = (theme) => {
    document.body.setAttribute('data-bs-theme', theme)
  }
  return { setTheme }
}
