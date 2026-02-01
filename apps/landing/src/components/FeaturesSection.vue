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
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.1);
}

.feature-icon {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
