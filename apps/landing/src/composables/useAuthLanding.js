/**
 * Authentication Composable for Landing Page
 * Manages login/signup state and user session
 */

import { ref, computed } from 'vue'
import AuthService from '../services/authService'

export function useAuthLanding() {
  const loading = ref(false)
  const error = ref('')
  const user = ref(AuthService.getUser())
  const isAuthenticated = computed(() => AuthService.isAuthenticated())

  // Handle storage events for logout from other tabs/apps
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_token' || event.key === 'auth_user' || !event.key) {
      user.value = AuthService.getUser()
    }
  })

  /**
   * Login with email and password
   */
  async function login(email, password) {
    loading.value = true
    error.value = ''

    try {
      const response = await AuthService.login(email, password)
      user.value = response.user
      return response
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Register new user
   */
  async function register(email, password, tenant_name) {
    loading.value = true
    error.value = ''

    try {
      const response = await AuthService.register(email, password, tenant_name)
      user.value = response.user
      return response
    } catch (err) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout
   */
  function logout() {
    AuthService.logout()
    user.value = null
    error.value = ''
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = ''
  }

  return {
    loading,
    error,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
  }
}
