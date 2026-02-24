import { ref, watch, onMounted } from 'vue'

const theme = ref('dark')

export function useTheme() {
  const initTheme = () => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    theme.value = stored || (prefersDark ? 'dark' : 'light')
    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    if (theme.value === 'light') {
      html.classList.add('light-mode')
    } else {
      html.classList.remove('light-mode')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme()
  })

  onMounted(() => {
    initTheme()
  })

  return {
    theme,
    toggleTheme,
    initTheme,
  }
}
