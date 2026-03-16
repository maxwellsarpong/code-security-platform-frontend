import DashboardAuthService from './authService'

export class ScanService {
  /**
   * Fetch all scans
   */
  static async getScans() {
    try {
      const response = await DashboardAuthService.request('/scans')
      if (!response.ok) {
        throw new Error('Failed to fetch scans')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching scans:', error)
      throw error
    }
  }

  /**
   * Get dashboard statistics from scans
   */
  static getStats(scans) {
    const hasData = scans && scans.length > 0

    let openIssues = hasData ? scans.reduce((acc, scan) => acc + (scan.findings ? scan.findings.length : 0), 0) : 0
    const uniqueRepos = hasData ? new Set(scans.map(scan => scan.repo_url)).size : 0
    const scansToday = hasData ? scans.filter(scan => {
      const scanDate = new Date(scan.time || scan.created_at)
      const today = new Date()
      return scanDate.toDateString() === today.toDateString()
    }).length : 0

    let criticalCount = hasData ? scans.reduce((acc, scan) => {
      const count = (scan.findings || []).filter(f =>
        (f.severity || '').toUpperCase() === 'CRITICAL' || (f.severity || '').toUpperCase() === 'HIGH'
      ).length
      return acc + count
    }, 0) : 0

    return [
      {
        label: 'Open issues',
        value: openIssues.toString(),
        change: criticalCount > 0 ? `${criticalCount} critical/high` : 'No critical issues',
        trend: criticalCount > 0 ? 'up' : null
      },
      {
        label: 'Repos scanned',
        value: uniqueRepos.toString(),
        change: 'Active repositories',
        trend: null
      },
      {
        label: 'Scans today',
        value: scansToday.toString(),
        change: scansToday > 0 ? 'New activity' : 'No scans yet',
        trend: scansToday > 0 ? 'up' : null
      },
      {
        label: 'Secrets blocked',
        value: '0',
        change: 'Security baseline',
        trend: null
      },
    ]
  }

  /**
   * Get chart data for scans over time
   */
  static getScansOverTime(scans) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const scansCount = [0, 0, 0, 0, 0, 0, 0]
    const issuesCount = [0, 0, 0, 0, 0, 0, 0]

    const dataToProcess = (scans && scans.length) ? scans : []

    dataToProcess.forEach(scan => {
      const date = new Date(scan.time || scan.created_at || scan.updated_at)
      const day = date.getDay() // 0 is Sunday
      // Adjust to Mon-Sun (Mon=0, Tue=1, ..., Sun=6)
      const adjustedDay = (day === 0) ? 6 : day - 1

      if (adjustedDay >= 0 && adjustedDay < 7) {
        scansCount[adjustedDay]++
        issuesCount[adjustedDay] += (scan.issues || (scan.findings ? scan.findings.length : 0))
      }
    })

    return {
      labels,
      datasets: [
        { label: 'Scans', data: scansCount, color: '#22d3ee', fill: true },
        { label: 'Issues found', data: issuesCount, color: '#f87171', fill: true, fillColor: '#f87171' },
      ],
    }
  }

  /**
   * Get severity data for doughnut chart
   */
  static getSeverityData(scans) {
    const severityCounts = {
      'CRITICAL': 0,
      'HIGH': 0,
      'MEDIUM': 0,
      'LOW': 0
    }

    const dataToProcess = (scans && scans.length) ? scans : []

    dataToProcess.forEach(scan => {
      if (scan.findings) {
        scan.findings.forEach(finding => {
          const sev = (finding.severity || 'LOW').toUpperCase()
          if (severityCounts.hasOwnProperty(sev)) {
            severityCounts[sev]++
          } else {
            severityCounts['LOW']++
          }
        })
      }
    })

    return [
      severityCounts['CRITICAL'],
      severityCounts['HIGH'],
      severityCounts['MEDIUM'],
      severityCounts['LOW']
    ]
  }

  /**
   * Returns a display name for the scan (Local vs Remote)
   */
  static getScanName(scan) {
    if (!scan) return 'Unknown'
    if (scan.is_local) return 'Local Workspace'
    if (!scan.repo_url) return 'Local Scan'
    
    // Return the last part of the URL (the repo name)
    try {
      const parts = scan.repo_url.split('/')
      return parts.pop() || scan.repo_url
    } catch (e) {
      return scan.repo_url
    }
  }

}

export default ScanService
