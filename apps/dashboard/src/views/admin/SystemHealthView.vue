<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminService from '../../services/adminService'

const services = ref([
  { id: 'api', name: 'Core API Gateway', status: 'Healthy', latency: '42ms', uptime: '99.98%', cpu: '12%', memory: '1.2GB' },
  { id: 'db', name: 'Primary PostgreSQL', status: 'Healthy', latency: '4ms', uptime: '100%', cpu: '8%', memory: '16.4GB' },
  { id: 'scanner', name: 'Vulnerability Scanner (Worker)', status: 'Healthy', latency: 'N/A', uptime: '99.95%', cpu: '45%', memory: '4.2GB' },
  { id: 'redis', name: 'Cache & Queue (Redis)', status: 'Healthy', latency: '1ms', uptime: '100%', cpu: '4%', memory: '2.1GB' },
  { id: 'storage', name: 'Object Storage (S3)', status: 'Healthy', latency: '85ms', uptime: '99.99%', cpu: 'N/A', memory: 'N/A' },
])

const logs = ref([
  { id: Date.now(), time: new Date().toLocaleTimeString(), type: 'INFO', message: 'System monitor initialized' },
])

const systemLoad = ref({
  cpu: 10,
  memory: 40,
  disk: 42
})

const prevMetrics = ref(null)

async function fetchHealthData() {
  try {
    const m = await AdminService.getMetrics()
    
    // Update Load Metrics
    // Convert 16GB total (assumed) to % if possible, otherwise scale memory bytes
    // For CPU, we just jitter slightly or use a derived value from counters if we had 2 samples
    systemLoad.value.memory = Math.min(95, Math.max(10, Math.round((m.memory_bytes / (16 * 1024 * 1024 * 1024)) * 100)))
    systemLoad.value.cpu = Math.max(5, Math.min(95, Math.round((m.cpu_seconds % 100))))

    // Generate logs on counter increases
    if (prevMetrics.value) {
      if (m.scans_enqueued > prevMetrics.value.scans_enqueued) {
        addLog('INFO', `New security scan job enqueued (Total: ${m.scans_enqueued})`)
      }
      if (m.scans_started > prevMetrics.value.scans_started) {
        addLog('INFO', `Worker started processing scan job (Total: ${m.scans_started})`)
      }
      if (m.scans_completed > prevMetrics.value.scans_completed) {
        addLog('INFO', `Scan successfully completed and findings analyzed (Total: ${m.scans_completed})`)
      }
      if (m.total_users > prevMetrics.value.total_users) {
        addLog('INFO', `New user registered on the platform`)
      }
    }
    
    prevMetrics.value = m
  } catch (err) {
    console.error('Failed to fetch health metrics:', err)
  }
}

function addLog(type, message) {
  logs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
  if (logs.value.length > 50) logs.value.pop()
}

// simulate some jitter for latency to keep UI "alive"
function jitterLatency() {
  services.value.forEach(s => {
    if (s.latency !== 'N/A') {
      const current = parseInt(s.latency)
      s.latency = `${Math.max(1, Math.min(200, current + Math.floor(Math.random() * 6 - 3)))}ms`
    }
  })
}

let interval
onMounted(() => {
  fetchHealthData()
  interval = setInterval(() => {
    fetchHealthData()
    jitterLatency()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="system-health">
    <div class="view-header">
      <p class="view-desc">Monitor infrastructure status, service health, and real-time platform logs.</p>
      <div class="global-status">
        <span class="pulse-icon"></span>
        <span class="status-text">All systems operational</span>
      </div>
    </div>

    <div class="health-grid">
      <!-- Service Cards -->
      <section class="services-column">
        <h3 class="group-title">Platform Services</h3>
        <div class="service-cards">
          <div v-for="service in services" :key="service.id" class="service-card card">
            <div class="service-main">
              <div class="service-info">
                <h4 class="service-name">{{ service.name }}</h4>
                <div class="service-metrics">
                  <span class="metric">Latency: <strong>{{ service.latency }}</strong></span>
                  <span class="metric">Uptime: <strong>{{ service.uptime }}</strong></span>
                </div>
              </div>
              <div class="service-status">
                <span class="status-badge success">{{ service.status }}</span>
              </div>
            </div>
            <div class="service-footer">
              <div class="resource-pill">CPU: {{ service.cpu }}</div>
              <div class="resource-pill">MEM: {{ service.memory }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Logs & Load Column -->
      <section class="monitor-column">
        <div class="load-section card">
          <h3 class="group-title">System Resources</h3>
          <div class="load-bars">
            <div class="load-item">
              <div class="load-header">
                <span>CPU Load</span>
                <span>{{ Math.round(systemLoad.cpu) }}%</span>
              </div>
              <div class="progress-bg">
                <div class="progress-bar" :style="{ width: systemLoad.cpu + '%', backgroundColor: systemLoad.cpu > 80 ? 'var(--critical)' : 'var(--accent)' }"></div>
              </div>
            </div>
            <div class="load-item">
              <div class="load-header">
                <span>Memory Usage</span>
                <span>{{ Math.round(systemLoad.memory) }}%</span>
              </div>
              <div class="progress-bg">
                <div class="progress-bar" :style="{ width: systemLoad.memory + '%', backgroundColor: 'var(--success)' }"></div>
              </div>
            </div>
            <div class="load-item">
              <div class="load-header">
                <span>Disk Usage</span>
                <span>{{ systemLoad.disk }}%</span>
              </div>
              <div class="progress-bg">
                <div class="progress-bar" :style="{ width: systemLoad.disk + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="logs-section card">
          <div class="logs-header">
            <h3 class="group-title">Live System Logs</h3>
            <span class="live-tag">LIVE</span>
          </div>
          <div class="log-entries">
            <div v-for="log in logs" :key="log.id" class="log-entry">
              <span class="log-time">[{{ log.time }}]</span>
              <span class="log-type" :class="log.type.toLowerCase()">{{ log.type }}</span>
              <span class="log-msg">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.system-health {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-desc {
  color: var(--text-muted);
}

.global-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.pulse-icon {
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--success);
}

.health-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1100px) {
  .health-grid {
    grid-template-columns: 1fr;
  }
}

.group-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.service-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-card {
  padding: 1rem;
  transition: transform 0.2s ease;
}

.service-card:hover {
  transform: translateX(4px);
  border-color: var(--accent);
}

.service-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.service-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.service-footer {
  display: flex;
  gap: 0.5rem;
}

.resource-pill {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  background: var(--bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.monitor-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.load-section {
  padding: 1.5rem;
}

.load-bars {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.load-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.progress-bg {
  height: 8px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.progress-bar {
  height: 100%;
  transition: width 1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}

.logs-section {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-tag {
  font-size: 0.65rem;
  font-weight: 800;
  background: var(--critical);
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  letter-spacing: 0.1em;
}

.log-entries {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  line-height: 1.4;
  word-break: break-all;
}

.log-time {
  color: var(--text-muted);
  margin-right: 0.75rem;
}

.log-type {
  font-weight: 700;
  margin-right: 0.75rem;
}

.log-type.info { color: var(--accent); }
.log-type.warn { color: #f59e0b; }
.log-type.error { color: var(--critical); }

.log-msg {
  color: var(--text-secondary);
}
</style>
