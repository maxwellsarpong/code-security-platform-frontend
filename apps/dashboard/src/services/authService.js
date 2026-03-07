/**
 * Dashboard Authentication Service
 * Handles JWT token and API communication
 */

const API_URL = 'https://code-security-platform.onrender.com/api/v1'
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export class DashboardAuthService {
  /**
   * Get stored JWT token
   */
  static getToken() {
    // Handle both 'token' (old format) and 'auth_token' (localStorage key)
    return localStorage.getItem(TOKEN_KEY)
  }

  /**
   * Get stored user data
   */
  static getUser() {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  }

  /**
   * Logout - clear stored credentials
   */
  static logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Note: we intentionally do NOT dispatch a storage event here.
    // The storage event listener in useAuth.js would immediately set
    // isAuthenticated=false, which fires the watcher and causes an
    // instant redirect before the logout feedback delay completes.
    // The redirect is handled explicitly in the logout() function.
  }

  /**
   * Fetch user profile from API
   */
  static async fetchUserProfile() {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
          throw new Error('Unauthorized - please login again')
        }
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      const user = data.user || data
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      }
      return user
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  }

  /**
   * Update user profile settings using API
   */
  static async updateUserProfile(payload) {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
          throw new Error('Unauthorized - please login again')
        }

        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || 'Failed to update profile')
      }

      const data = await response.json()
      const updatedUser = data.user || data
      if (updatedUser) {
        const currentUser = this.getUser() || {}
        localStorage.setItem(USER_KEY, JSON.stringify({ ...currentUser, ...updatedUser }))
      }
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  /**
   * Make authenticated API request
   */
  static async request(endpoint, options = {}) {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'omit',
    })

    if (response.status === 401) {
      this.logout()
      throw new Error('Unauthorized - please login again')
    }

    return response
  }
}

export default DashboardAuthService
