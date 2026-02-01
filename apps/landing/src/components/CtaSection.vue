<script setup>
</script>

<template>
  <section id="cta" class="section cta">
    <div class="container cta-inner">
      <h2 class="cta-title">Ready to secure your codebase?</h2>
      <p class="cta-subtitle">
        Join thousands of teams shipping with confidence. Set up in minutes.
      </p>
      <div class="cta-actions">
        <a href="/dashboard" class="btn btn-primary btn-lg">Go to dashboard</a>
        <a href="#billing" class="btn btn-outline btn-lg">View pricing</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
}

.cta-inner {
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cta-subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.9rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
}

.btn-primary:hover {
  background: #67e8f9;
  text-decoration: none;
}

.btn-outline {
  color: var(--accent);
  border: 2px solid var(--accent);
  background: transparent;
}

.btn-outline:hover {
  background: rgba(34, 211, 238, 0.1);
  text-decoration: none;
}
</style>
