/**
 * Composable for dashboard navigation
 * Manages the dashboard URL and provides helper methods for navigation
 */

export function useDashboard() {
  /**
   * Navigate to dashboard after authentication
   * Both apps run on the same port now, dashboard is at /app path
   */
  const goToDashboard = (user = null) => {
    // Redirect based on user role if provided
    if (user?.is_superuser) {
      window.location.href = '/app/admin'
    } else {
      // Default to regular dashboard
      window.location.href = '/app/'
    }
  }

  /**
   * Get a dashboard path URL
   * @param {string} path - Path within the dashboard (e.g., '/scans', '/settings')
   */
  const getDashboardPath = (path = '') => {
    return `/app${path || ''}`
  }

  /**
   * Check if we're running in production
   */
  const isProduction = () => {
    return import.meta.env.PROD
  }

  return {
    dashboardUrl: '/app',
    goToDashboard,
    getDashboardPath,
    isProduction,
  }
}
