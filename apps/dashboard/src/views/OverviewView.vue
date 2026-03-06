<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import BillingService from '../services/billingService'
import StatCard from '../components/modern/StatCard.vue'
import LineChart from '../components/charts/LineChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import ScanService from '../services/scanService'

const { currentTenantName } = useAuth()

const scans = ref([])
const usageData = ref(null)
const isLoading = ref(true)
const error = ref(null)

const stats = computed(() => ScanService.getStats(scans.value))
const scansOverTimeData = computed(() => ScanService.getScansOverTime(scans.value))
const severityData = computed(() => ScanService.getSeverityData(scans.value))

const severityLabels = ['Critical', 'High', 'Medium', 'Low']
const severityColors = ['#f87171', '#fb923c', '#facc15', '#94a3b8']

const recentScans = computed(() => {
  return scans.value
    .slice(0, 5)
    .map(s => ({
      repo: s.repo_url.split('/').pop(),
      branch: 'main', // Defaulting since it's not in the API yet
      status: s.status === 'completed' ? 'passed' : s.status,
      time: formatTime(s.time || s.created_at),
      issues: s.findings ? s.findings.length : 0
    }))
})

const criticalFindings = computed(() => {
  const findings = []
  scans.value.forEach(s => {
    if (s.findings) {
      s.findings.forEach(f => {
        const severity = (f.severity || '').toUpperCase()
        if (severity === 'CRITICAL' || severity === 'HIGH') {
          findings.push({
            id: (f.id || 'N/A').toString().substring(0, 6),
            repo: (s.repo_url || '').split('/').pop() || 'unknown',
            type: f.title || 'Security Finding',
            severity: severity.toLowerCase(),
            created: formatTime(f.created_at || s.time)
          })
        }
      })
    }
  })


  return findings.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    return 0
  }).slice(0, 5)
})

function formatTime(timestamp) {
  if (!timestamp) return 'N/A'
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return 'N/A'
    
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  } catch (e) {
    return 'N/A'
  }
}

async function loadData() {
  try {
    isLoading.value = true
    error.value = null
    
    // Fetch both scans and usage data in parallel
    const [scansResult, usageResult] = await Promise.all([
      ScanService.getScans().catch(() => []),
      BillingService.getUserUsage().catch(() => null)
    ])
    
    usageData.value = usageResult
    
    scans.value = scansResult || []
    error.value = null 
  } catch (err) {
    console.error('Overview load error:', err)
    scans.value = []
    error.value = null 
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="overview">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadData">Retry</button>
    </div>

    <template v-else>
    <!-- Quota usage bar -->
    <div v-if="usageData" class="tenant-context">
      <span class="context-icon">💡</span>
      You've used <strong>{{ usageData.current_month_usage || 0 }}</strong> 
      of your <strong>{{ usageData.scan_quota_limit || 0 }}</strong> monthly scans.
      <router-link to="/billing" class="link" style="margin-left: 0.5rem">Manage Billing</router-link>
    </div>
    <div class="stats-grid">
      <StatCard 
        v-for="s in stats" 
        :key="s.label"
        :label="s.label"
        :value="s.value"
        :change="s.change"
        :trend="s.trend"
      />
    </div>

    <div class="charts-row">
      <section class="card section-card chart-card">
        <h2 class="chart-title">Scans & issues (last 7 days)</h2>
        <LineChart
          :labels="scansOverTimeData.labels"
          :datasets="scansOverTimeData.datasets"
          :height="220"
        />
      </section>
      <section class="card section-card chart-card">
        <h2 class="chart-title">Findings by severity</h2>
        <DoughnutChart
          :labels="severityLabels"
          :data="severityData"
          :colors="severityColors"
          :height="220"
        />
      </section>
    </div>

    <div class="overview-grid">
      <section class="card section-card">
        <div class="section-header">
          <h2>Recent scans</h2>
          <router-link to="/scans" class="link">View all</router-link>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Issues</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in recentScans" :key="`${row.repo}-${row.branch}`">
                <td>{{ row.repo }}</td>
                <td><code class="code">{{ row.branch }}</code></td>
                <td>
                  <span class="badge" :class="row.status === 'passed' ? 'badge--success' : 'badge--critical'">
                    {{ row.status }}
                  </span>
                </td>
                <td>{{ row.issues }}</td>
                <td class="text-muted">{{ row.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card section-card">
        <div class="section-header">
          <h2>Critical findings</h2>
          <router-link to="/scans" class="link">View all</router-link>
        </div>
        <ul class="findings-list">
          <li v-for="f in criticalFindings" :key="f.id" class="finding-item">
            <div class="finding-main">
              <span class="finding-id">{{ f.id }}</span>
              <span class="badge" :class="f.severity === 'critical' ? 'badge--critical' : 'badge--high'">
                {{ f.severity }}
              </span>
            </div>
            <div class="finding-meta">
              <span>{{ f.type }}</span>
              <span class="text-muted">{{ f.repo }} · {{ f.created }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
    </template>
  </div>
</template>

<style scoped>
.loading-overlay, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1.5rem;
  width: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-light);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tenant-context {
  font-size: 0.9rem;
  color: var(--text-muted);
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(6, 182, 212, 0.08) 100%);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.context-icon {
  color: var(--accent);
  opacity: 0.7;
}

.tenant-context strong {
  color: var(--accent);
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2rem;
}

.charts-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.75rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  padding: 1.75rem;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.chart-card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15), var(--shadow-lg);
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.75rem 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
}

@media (max-width: 1024px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  padding: 1.75rem;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.section-card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15), var(--shadow-lg);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid var(--border-light);
}

.section-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.link {
  font-size: 0.9rem;
  color: var(--accent);
  font-weight: 700;
  transition: all var(--transition-base);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  text-decoration: none;
}

.link:hover {
  color: var(--accent-hover);
  gap: 0.5rem;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--bg-elevated);
  padding: 0.35rem 0.625rem;
  border-radius: var(--radius-sm);
  color: var(--accent);
  border: 1px solid var(--border-accent);
  font-weight: 600;
}

.text-muted {
  color: var(--text-muted);
}

.table-wrap {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.findings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.finding-item {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-light);
  transition: background-color var(--transition-base);
  margin: 0 -1.75rem;
  padding: 1.25rem 1.75rem;
  cursor: pointer;
}

.finding-item:hover {
  background: rgba(6, 182, 212, 0.05);
}

.finding-item:last-child {
  border-bottom: none;
  margin-bottom: -1.75rem;
}

.finding-main {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.625rem;
}

.finding-id {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 700;
  min-width: fit-content;
}

.finding-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.finding-meta span:first-child {
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
