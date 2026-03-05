<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminService from '../../services/adminService'
import LineChart from '../../components/charts/LineChart.vue'
import BarChart from '../../components/charts/BarChart.vue'

const metrics = ref(null)
const scans = ref([])
const fixedFindings = ref([])
const loading = ref(true)
const error = ref(null)

const stats = computed(() => [
  { 
    label: 'Total Users', 
    value: metrics.value?.total_users || 0,
    sub: 'Platform wide'
  },
  { 
    label: 'Total Scans', 
    value: metrics.value?.total_scans || scans.value.length || 0,
    sub: 'All time'
  },
  { 
    label: 'Issues Fixed', 
    value: metrics.value?.total_fixed || fixedFindings.value.length || 0,
    sub: 'Total resolved'
  },
  { 
    label: 'System Health', 
    value: '99.9%',
    sub: 'Uptime'
  },
])

const recentActivity = computed(() => {
  // Merge and sort scans and findings for a timeline
  const activity = [
    ...scans.value.slice(0, 5).map(s => ({ ...s, type: 'Scan', date: s.created_at || s.time })),
    ...fixedFindings.value.slice(0, 5).map(f => ({ ...f, type: 'Fix', date: f.fixed_at || f.created_at }))
  ]
  return activity.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
})

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const [m, s, f] = await Promise.all([
      AdminService.getMetrics(),
      AdminService.getAllScans(),
      AdminService.getFixedFindings()
    ])
    metrics.value = m
    scans.value = s
    fixedFindings.value = f
  } catch (err) {
    console.error('Failed to fetch admin overview data:', err)
    error.value = 'Failed to load platform data. Please ensure you have admin privileges.'
    
    // Fallback mock data if API fails to show structure
    metrics.value = { total_users: 124, total_scans: 842, total_fixed: 156 }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Chart Data (Placeholder for now, in real app would derive from metrics history)
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'System Scans', data: [120, 150, 180, 220, 280, 310], color: '#22d3ee', fill: true },
    { label: 'Vulnerabilities Fixed', data: [45, 52, 68, 85, 92, 110], color: '#34d399', fill: true },
  ],
}
</script>

<template>
  <div class="admin-overview">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching platform metrics...</p>
    </div>

    <div v-else-if="error" class="error-banner card">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="fetchData" class="btn btn-ghost btn-sm">Retry</button>
    </div>

    <template v-else>
      <div class="stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card card">
          <span class="stat-label">{{ s.label }}</span>
          <div class="stat-main">
            <span class="stat-value">{{ s.value }}</span>
            <span class="stat-sub">{{ s.sub }}</span>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <section class="card section-card chart-card">
          <h2 class="chart-title">Platform Performance Activity</h2>
          <LineChart
            :labels="chartData.labels"
            :datasets="chartData.datasets"
            :height="220"
          />
        </section>
        
        <section class="card section-card recent-activity">
          <h2 class="chart-title">Recent Platform Events</h2>
          <div class="activity-feed">
            <div v-for="item in recentActivity" :key="item.id" class="activity-item">
              <div class="activity-icon" :class="item.type.toLowerCase()">
                {{ item.type === 'Scan' ? '🔍' : '✅' }}
              </div>
              <div class="activity-content">
                <span class="activity-type">{{ item.type }}</span>
                <p class="activity-msg">
                  {{ item.type === 'Scan' ? `Scan completed for ${item.repo_url || 'Repo'}` : `Finding fixed: ${item.title || 'Security Issue'}` }}
                </p>
                <span class="activity-time">{{ new Date(item.date).toLocaleString() }}</span>
              </div>
            </div>
            <div v-if="recentActivity.length === 0" class="empty-activity">
              No recent activity recorded.
            </div>
          </div>
        </section>
      </div>

      <section class="card section-card">
        <h2 class="section-title">System Health & Nodes</h2>
        <div class="nodes-grid">
          <div class="node-status card">
            <div class="node-header">
              <span class="node-name">Main-API-Cluster</span>
              <span class="status-dot healthy"></span>
            </div>
            <div class="node-stats">
              <span>CPU: 14%</span>
              <span>Memory: 2.4GB</span>
            </div>
          </div>
          <div class="node-status card">
            <div class="node-header">
              <span class="node-name">Worker-Scanner-01</span>
              <span class="status-dot healthy"></span>
            </div>
            <div class="node-stats">
              <span>CPU: 88%</span>
              <span>Memory: 4.1GB</span>
            </div>
          </div>
          <div class="node-status card">
            <div class="node-header">
              <span class="node-name">Postgres-Primary</span>
              <span class="status-dot healthy"></span>
            </div>
            <div class="node-stats">
              <span>CPU: 8%</span>
              <span>Memory: 12GB</span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.admin-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-muted);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(34, 211, 238, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--critical);
  background: rgba(239, 68, 68, 0.05);
}

.error-icon {
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent);
}

.stat-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

@media (max-width: 1000px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.recent-activity {
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent grid blow-out */
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--bg-elevated);
}

.activity-icon.scan { background: rgba(34, 211, 238, 0.1); }
.activity-icon.fix { background: rgba(52, 211, 153, 0.1); }

.activity-content {
  display: flex;
  flex-direction: column;
}

.activity-type {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.activity-msg {
  font-size: 0.9rem;
  margin: 0.15rem 0;
  color: var(--text-secondary);
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.node-status {
  padding: 1rem;
  background: var(--bg);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.node-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.healthy {
  background: var(--success);
  box-shadow: 0 0 8px var(--success);
}

.node-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}
</style>
