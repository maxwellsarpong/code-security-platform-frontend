/**
 * Authentication Service
 * Handles JWT login, token storage, and API communication
 */

const API_URL = 'https://code-security-platform.onrender.com/api/v1'
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export class AuthService {
  /**
   * Fetch user profile from API
   * @param {string} token - JWT access token
   */
  static async fetchUserProfile(token) {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error('Failed to fetch user profile')
      }

      const data = await response.json()
      return data.user || data
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  }

  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{access_token: string, token_type: string}>}
   */
  static async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || error.message || 'Login failed')
      }

      const data = await response.json()

      // Backend returns access_token, not token
      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token)
      }

      // Fetch user profile data after successful login
      let userProfile = null
      try {
        userProfile = await this.fetchUserProfile(data.access_token)
        if (userProfile) {
          localStorage.setItem(USER_KEY, JSON.stringify(userProfile))
        }
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError)
      }

      return { ...data, user: userProfile }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{access_token: string, token_type: string}>}
   */
  static async register(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || error.message || 'Registration failed')
      }

      const data = await response.json()

      // Backend returns access_token, not token
      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token)
      }

      // Fetch user profile data after successful registration
      let userProfile = null
      try {
        userProfile = await this.fetchUserProfile(data.access_token)
        if (userProfile) {
          localStorage.setItem(USER_KEY, JSON.stringify(userProfile))
        }
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError)
      }

      return { ...data, user: userProfile }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Request password recovery for a user
   * @param {string} email
   */
  static async requestPasswordRecovery(email) {
    try {
      const response = await fetch(`${API_URL}/auth/request-password-recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || error.message || 'Failed to send password recovery request')
      }

      return await response.json()
    } catch (error) {
      console.error('Password recovery request error:', error)
      throw error
    }
  }

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} new_password
   */
  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || error.message || 'Failed to reset password')
      }

      return await response.json()
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  /**
   * Logout - clear stored credentials
   */
  static logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Intentionally not dispatching storage event - that would immediately
    // collapse the UI before the logout animation can complete.
  }

  /**
   * Get stored JWT token
   */
  static getToken() {
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
   * Make authenticated API request
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
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
    })

    if (response.status === 401) {
      // Token expired or invalid, logout
      this.logout()
      throw new Error('Unauthorized - please login again')
    }

    return response
  }
}

export default AuthService
