<script setup>
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="cta" class="section cta">
    <div class="container cta-inner">
      <h2 class="cta-title">Ready to secure your codebase?</h2>
      <p class="cta-subtitle">
        Join thousands of teams shipping with confidence. Set up in minutes.
      </p>
      <div class="cta-actions">
        <router-link to="/login" class="btn btn-primary btn-lg">Go to dashboard</router-link>
        <button @click="scrollToSection('billing')" class="btn btn-outline btn-lg" type="button">View pricing</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, var(--bg-elevated) 100%);
  border-top: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 100%, rgba(34, 211, 238, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.cta-inner {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-subtitle {
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.9rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.3);
}

.btn-primary:hover {
  background: #67e8f9;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(34, 211, 238, 0.4);
  text-decoration: none;
}

.btn-outline {
  color: var(--accent);
  border: 2px solid var(--accent);
  background: transparent;
}

.btn-outline:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: #67e8f9;
  color: #67e8f9;
  transform: translateY(-2px);
  text-decoration: none;
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.2);
}
</style>
