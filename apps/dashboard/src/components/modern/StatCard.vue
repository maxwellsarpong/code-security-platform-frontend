<template>
  <div class="stat-card" :class="[{ 'stat-card--up': trend === 'up', 'stat-card--down': trend === 'down' }]">
    <div class="stat-header">
      <div class="stat-label">{{ label }}</div>
      <div v-if="trend" class="stat-trend" :class="`trend--${trend}`">
        {{ trend === 'up' ? '↑' : '↓' }}
      </div>
    </div>
    
    <div class="stat-value">{{ value }}</div>
    
    <div v-if="change" class="stat-change">
      {{ change }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  change: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    validator: (v) => v === 'up' || v === 'down' || v === null || v === undefined
  }
})
</script>

<style scoped>
.stat-card {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent-dim) 100%);
  opacity: 0.5;
}

.stat-card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15), var(--shadow-lg);
  transform: translateY(-4px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-trend {
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  background: var(--success-light);
  color: var(--success);
}

.stat-trend.trend--down {
  background: var(--critical-light);
  color: var(--critical);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.stat-change {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
