<script setup>
import { useAuth } from '../composables/useAuth'
import LineChart from '../components/charts/LineChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'

const { currentTenantName } = useAuth()

const stats = [
  { label: 'Open issues', value: '24', change: '-3 this week', trend: 'down' },
  { label: 'Repos scanned', value: '12', change: 'All passing' },
  { label: 'Scans today', value: '48', change: '+12 vs yesterday' },
  { label: 'Secrets blocked', value: '7', change: 'Last 7 days' },
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
    <p v-if="currentTenantName" class="tenant-context">Viewing: <strong>{{ currentTenantName }}</strong></p>
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card card">
        <span class="stat-label">{{ s.label }}</span>
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-change">{{ s.change }}</span>
      </div>
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
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--accent);
}

.stat-change {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.tenant-context {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.tenant-context strong {
  color: var(--accent);
}

.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  padding: 1.25rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  padding: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.link {
  font-size: 0.85rem;
  color: var(--accent);
}

.link:hover {
  text-decoration: underline;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background: var(--bg-elevated);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.text-muted {
  color: var(--text-muted);
}

.findings-list {
  list-style: none;
}

.finding-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.finding-item:last-child {
  border-bottom: none;
}

.finding-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.finding-id {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.finding-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.finding-meta span:first-child {
  color: var(--text);
  margin-right: 0.5rem;
}
</style>
