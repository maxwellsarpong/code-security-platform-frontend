<script setup>
import { useAuth } from '../composables/useAuth'
import StatCard from '../components/modern/StatCard.vue'
import LineChart from '../components/charts/LineChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'

const { currentTenantName } = useAuth()

const stats = [
  { label: 'Open issues', value: '24', change: '-3 this week', trend: 'down' },
  { label: 'Repos scanned', value: '12', change: 'All passing', trend: null },
  { label: 'Scans today', value: '48', change: '+12 vs yesterday', trend: 'up' },
  { label: 'Secrets blocked', value: '7', change: 'Last 7 days', trend: null },
]

const scansOverTimeLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const scansOverTimeData = {
  labels: scansOverTimeLabels,
  datasets: [
    { label: 'Scans', data: [32, 45, 38, 52, 48, 28, 48], color: '#22d3ee', fill: true },
    { label: 'Issues found', data: [8, 12, 6, 14, 10, 4, 7], color: '#f87171', fill: true, fillColor: '#f87171' },
  ],
}

const severityLabels = ['Critical', 'High', 'Medium', 'Low']
const severityData = [5, 12, 28, 15]
const severityColors = ['#f87171', '#fb923c', '#facc15', '#94a3b8']

const recentScans = [
  { repo: 'acme-api', branch: 'main', status: 'passed', time: '2 min ago', issues: 0 },
  { repo: 'acme-web', branch: 'feat/auth', status: 'failed', time: '15 min ago', issues: 2 },
  { repo: 'acme-mobile', branch: 'main', status: 'passed', time: '1 hr ago', issues: 0 },
  { repo: 'acme-api', branch: 'develop', status: 'passed', time: '2 hrs ago', issues: 0 },
]

const criticalFindings = [
  { id: 'F-2847', repo: 'acme-web', type: 'Secret detected', severity: 'critical', created: '1 day ago' },
  { id: 'F-2841', repo: 'acme-api', type: 'SQL injection', severity: 'high', created: '2 days ago' },
  { id: 'F-2833', repo: 'acme-mobile', type: 'Outdated dep (CVE)', severity: 'high', created: '3 days ago' },
]
</script>

<template>
  <div class="overview">
    <p v-if="currentTenantName" class="tenant-context">
      <span class="context-icon">•</span>
      Viewing: <strong>{{ currentTenantName }}</strong>
    </p>
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
  </div>
</template>

<style scoped>
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
