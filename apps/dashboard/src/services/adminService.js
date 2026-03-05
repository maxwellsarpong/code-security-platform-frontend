import DashboardAuthService from './authService'

export class AdminService {
    /**
     * Fetch all users across the platform (Admin only)
     */
    static async getAdminUsers() {
        try {
            const response = await DashboardAuthService.request('/admin/users')
            if (!response.ok) {
                throw new Error('Failed to fetch admin users')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching admin users:', error)
            throw error
        }
    }

    /**
     * Fetch platform-wide metrics
     * Handles both JSON and Prometheus/OpenMetrics text format
     */
    static async getMetrics() {
        try {
            const response = await DashboardAuthService.request('/metrics')
            if (!response.ok) {
                throw new Error('Failed to fetch platform metrics')
            }

            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                return await response.json()
            }

            // Fallback for Prometheus text format
            const text = await response.text()
            return this.parsePrometheusMetrics(text)
        } catch (error) {
            console.error('Error fetching metrics:', error)
            throw error
        }
    }

    /**
     * Basic parser for Prometheus text format to extract key metrics
     */
    static parsePrometheusMetrics(text) {
        const metrics = {
            total_users: 0,
            total_scans: 0,
            total_fixed: 0
        }

        const lines = text.split('\n')
        for (const line of lines) {
            if (line.startsWith('#') || !line.trim()) continue

            const [key, value] = line.split(/\s+/)
            const numValue = parseFloat(value)

            if (key.includes('users_total')) metrics.total_users = numValue
            if (key.includes('scans_total')) metrics.total_scans = numValue
            if (key.includes('findings_fixed_total')) metrics.total_fixed = numValue
        }

        return metrics
    }

    /**
     * Fetch fixed findings across the platform
     */
    static async getFixedFindings() {
        try {
            const response = await DashboardAuthService.request('/findings/fixed')
            if (!response.ok) {
                throw new Error('Failed to fetch fixed findings')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching fixed findings:', error)
            throw error
        }
    }

    /**
     * Fetch all scans across the platform
     */
    static async getAllScans() {
        try {
            const response = await DashboardAuthService.request('/scans')
            if (!response.ok) {
                throw new Error('Failed to fetch all scans')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching all scans:', error)
            throw error
        }
    }
}

export default AdminService
