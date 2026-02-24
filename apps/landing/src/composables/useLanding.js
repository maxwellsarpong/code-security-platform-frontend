/**
 * Composable for landing page utilities
 */

export function useLanding() {
  /**
   * Navigate to landing page home (same origin now)
   */
  const goToLanding = () => {
    window.location.href = '/'
  }

  return {
    goToLanding,
  }
}

