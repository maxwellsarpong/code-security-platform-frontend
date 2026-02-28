import DashboardAuthService from './authService'

export class BillingService {
  /**
   * Fetch current user's usage data
   * GET /api/v1/user/usage
   */
  static async getUserUsage() {
    try {
      const response = await DashboardAuthService.request('/user/usage')
      if (!response.ok) {
        throw new Error(`Failed to fetch usage data: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user usage:', error)
      throw error
    }
  }

  /**
   * Fetch tenant invoices (legacy, kept for future use)
   * @param {string} tenantId
   */
  static async getInvoices(tenantId) {
    try {
      const response = await DashboardAuthService.request(`/tenants/${tenantId}/invoices`)
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }
  }
}

export default BillingService
