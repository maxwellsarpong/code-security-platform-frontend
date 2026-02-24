<script setup>
import { ref, onMounted } from 'vue'

const barsAnimated = ref(false)

const bySeverity = [
  { label: 'Critical', count: 23, color: 'var(--critical)' },
  { label: 'High', count: 87, color: 'var(--high)' },
  { label: 'Medium', count: 312, color: 'var(--medium)' },
  { label: 'Low', count: 156, color: 'var(--low)' },
]

const byType = [
  { label: 'Secrets & keys', count: 94 },
  { label: 'SAST findings', count: 218 },
  { label: 'Dependencies (CVE)', count: 156 },
  { label: 'Config & policy', count: 110 },
]

const maxBySeverity = Math.max(...bySeverity.map((d) => d.count))
const maxByType = Math.max(...byType.map((d) => d.count))

onMounted(() => {
  requestAnimationFrame(() => {
    barsAnimated.value = true
  })
})
</script>

<template>
  <section id="metrics" class="section metrics">
    <div class="container">
      <h2 class="section-title">Vulnerabilities discovered in projects</h2>
      <p class="section-subtitle">
        Real metrics from teams using SecureCode. Issues caught before they reach production.
      </p>

      <div class="metrics-cards">
        <div class="metric-card">
          <span class="metric-value">578k+</span>
          <span class="metric-label">Issues found this month</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">94%</span>
          <span class="metric-label">Fixed within 7 days</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">12k+</span>
          <span class="metric-label">Projects secured</span>
        </div>
      </div>

      <div class="charts">
        <div class="chart-block">
          <h3 class="chart-title">By severity (sample project)</h3>
          <div class="bar-chart bar-chart--vertical">
            <div
              v-for="(row, i) in bySeverity"
              :key="row.label"
              class="bar-row"
            >
              <span class="bar-label">{{ row.label }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{
                    width: barsAnimated ? `${(row.count / maxBySeverity) * 100}%` : '0%',
                    backgroundColor: row.color,
                  }"
                />
                <span class="bar-value">{{ row.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-block">
          <h3 class="chart-title">By finding type (sample project)</h3>
          <div class="bar-chart bar-chart--vertical">
            <div
              v-for="(row, i) in byType"
              :key="row.label"
              class="bar-row"
            >
              <span class="bar-label">{{ row.label }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill bar-fill--accent"
                  :style="{
                    width: barsAnimated ? `${(row.count / maxByType) * 100}%` : '0%',
                  }"
                />
                <span class="bar-value">{{ row.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="metrics-note">
        Sample data from anonymized scans. Your dashboard shows live metrics for your repos.
      </p>
    </div>
  </section>
</template>

<style scoped>
.metrics {
  background: var(--bg);
  background: linear-gradient(135deg, transparent 0%, rgba(34, 211, 238, 0.03) 100%);
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.75rem 1.5rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
}

.metric-card:hover {
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 12px 32px rgba(34, 211, 238, 0.15);
  transform: translateY(-6px);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, var(--bg-card) 100%);
}

.metric-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.chart-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
}

.chart-block:hover {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 12px 32px rgba(34, 211, 238, 0.1);
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.75rem;
  color: var(--text);
}

.bar-chart--vertical .bar-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.bar-chart--vertical .bar-row:last-child {
  margin-bottom: 0;
}

.bar-label {
  flex: 0 0 140px;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}

.bar-track {
  flex: 1;
  position: relative;
  height: 32px;
  background: rgba(34, 211, 238, 0.05);
  border-radius: 8px;
  overflow: hidden;
  min-width: 0;
  border: 1px solid rgba(34, 211, 238, 0.1);
}

.bar-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.bar-fill--accent {
  background: linear-gradient(90deg, rgba(8, 145, 178, 0.8), var(--accent));
}

.bar-value {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text);
  z-index: 1;
}

.metrics-note {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
