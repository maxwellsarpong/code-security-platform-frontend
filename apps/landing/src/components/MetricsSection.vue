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
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--accent);
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  display: block;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.bar-chart--vertical .bar-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.bar-chart--vertical .bar-row:last-child {
  margin-bottom: 0;
}

.bar-label {
  flex: 0 0 120px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.bar-track {
  flex: 1;
  position: relative;
  height: 28px;
  background: var(--bg-elevated);
  border-radius: 6px;
  overflow: hidden;
  min-width: 0;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s ease-out;
}

.bar-fill--accent {
  background: linear-gradient(90deg, var(--accent-dim), var(--accent));
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--text);
  text-shadow: 0 0 8px rgba(10, 15, 26, 0.8);
  z-index: 1;
}

.metrics-note {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
