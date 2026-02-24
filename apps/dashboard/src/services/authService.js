/**
 * Dashboard Authentication Service
 * Handles JWT token and API communication
 */

const API_URL = 'http://localhost:8000/api/v1'
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
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
          throw new Error('Unauthorized - please login again')
        }
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      }
      return data.user
    } catch (error) {
      console.error('Profile fetch error:', error)
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
      credentials: 'include',
    })

    if (response.status === 401) {
      this.logout()
      throw new Error('Unauthorized - please login again')
    }

    return response
  }
}

export default DashboardAuthService
