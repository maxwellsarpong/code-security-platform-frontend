<script setup>
const features = [
  {
    icon: '◉',
    title: 'SAST & code analysis',
    description: 'Find bugs and security issues in your code before merge. Supports 30+ languages and frameworks.',
  },
  {
    icon: '🔑',
    title: 'Secrets detection',
    description: 'Block API keys, tokens, and credentials from ever reaching the repo. Pre-commit and CI hooks.',
  },
  {
    icon: '📦',
    title: 'Dependency scanning',
    description: 'Track known CVEs in your dependencies. Get alerts and suggested upgrades automatically.',
  },
  {
    icon: '📋',
    title: 'Compliance & policy',
    description: 'Enforce security and compliance policies across teams. SOC 2, ISO 27001, and custom rules.',
  },
]
</script>

<template>
  <section id="features" class="section features">
    <div class="container">
      <h2 class="section-title">Everything you need to ship secure code</h2>
      <p class="section-subtitle">
        One platform for scanning, fixing, and governing security across your entire codebase.
      </p>
      <div class="features-grid">
        <article v-for="f in features" :key="f.title" class="feature-card">
          <span class="feature-icon">{{ f.icon }}</span>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  background: var(--bg-elevated);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, var(--bg-elevated) 50%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
}

.feature-card:hover {
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 12px 32px rgba(34, 211, 238, 0.15);
  transform: translateY(-8px);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, var(--bg-card) 100%);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1.25rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(5deg);
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text);
}

.feature-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.65;
}
</style>
