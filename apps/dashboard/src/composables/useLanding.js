/**
 * Composable for landing page navigation from dashboard
 * Used for logout, return to home, etc.
 */

import DashboardAuthService from '../services/authService'

export function useLanding() {
  /**
   * Navigate to landing page home (same origin now)
   */
  const goToLanding = () => {
    window.location.href = '/'
  }

  /**
   * Navigate to a specific landing page path
   * @param {string} path - Path within landing (e.g., '/pricing', '/checkout')
   */
  const goToLandingPath = (path = '/') => {
    window.location.href = path
  }

  /**
   * Logout - clear credentials and navigate to landing
   */
  const logout = () => {
    // Clear JWT token and user data
    DashboardAuthService.logout()
    
    // Redirect to landing
    goToLanding()
  }

  return {
    goToLanding,
    goToLandingPath,
    logout,
  }
}
