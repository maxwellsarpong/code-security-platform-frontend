import { ref, onMounted } from 'vue'

const theme = ref('dark')

export function useTheme() {
  const initTheme = () => {
    // Always enforce dark mode, ignoring localStorage and system preferences
    theme.value = 'dark'
    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    // Since we only want dark mode, we always remove 'light-mode'
    html.classList.remove('light-mode')
  }

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    initTheme,
  }
}
