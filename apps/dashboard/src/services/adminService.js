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
            total_fixed: 0,
            cpu_seconds: 0,
            memory_bytes: 0,
            scans_enqueued: 0,
            scans_started: 0,
            scans_completed: 0
        }

        const lines = text.split('\n')
        for (const line of lines) {
            if (line.startsWith('#') || !line.trim()) continue

            const [key, value] = line.split(/\s+/)
            const numValue = parseFloat(value)

            if (key.includes('users_total')) metrics.total_users = numValue
            if (key.includes('scans_total') || key.includes('scp_scans_completed_total')) metrics.total_scans = numValue
            if (key.includes('findings_fixed_total')) metrics.total_fixed = numValue

            // System Metrics
            if (key === 'process_cpu_seconds_total') metrics.cpu_seconds = numValue
            if (key === 'process_resident_memory_bytes') metrics.memory_bytes = numValue

            // App Specific Counters for Logs
            if (key === 'scp_scans_enqueued_total') metrics.scans_enqueued = numValue
            if (key === 'scp_scans_started_total') metrics.scans_started = numValue
            if (key === 'scp_scans_completed_total') metrics.scans_completed = numValue
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

    /**
     * Fetch all platform scans (Admin only)
     */
    static async getAdminScans() {
        try {
            const response = await DashboardAuthService.request('/admin/scans')
            if (!response.ok) {
                throw new Error('Failed to fetch admin scans')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching admin scans:', error)
            throw error
        }
    }

    /**
     * Fetch all platform fixed findings (Admin only)
     */
    static async getAdminFixedFindings() {
        try {
            const response = await DashboardAuthService.request('/admin/findings/fixed')
            if (!response.ok) {
                throw new Error('Failed to fetch admin fixed findings')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching admin fixed findings:', error)
            throw error
        }
    }

    /**
     * Fetch all platform events (Admin only)
     */
    static async getAdminEvents() {
        try {
            const response = await DashboardAuthService.request('/admin/events')
            if (!response.ok) {
                throw new Error('Failed to fetch admin events')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching admin events:', error)
            throw error
        }
    }
}

export default AdminService
