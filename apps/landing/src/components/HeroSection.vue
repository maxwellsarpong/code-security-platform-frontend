<script setup>
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="badge">Code security for modern teams</div>
      <h1 class="hero-title">
        Ship secure code.<br />
        <span class="gradient">Catch vulnerabilities early.</span>
      </h1>
      <p class="hero-subtitle">
        Scan, fix, and enforce security across your repos. One platform for SAST, secrets detection,
        dependency checks, and compliance.
      </p>
      <div class="hero-actions">
        <a href="#billing" class="btn btn-primary btn-lg">Start free trial</a>
        <a href="#features" class="btn btn-outline btn-lg">See how it works</a>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-value">10M+</span>
          <span class="stat-label">Issues prevented</span>
        </div>
        <div class="stat">
          <span class="stat-value">50k+</span>
          <span class="stat-label">Developers</span>
        </div>
        <div class="stat">
          <span class="stat-value">99.9%</span>
          <span class="stat-label">Uptime</span>
        </div>
      </div>
    </div>
    <div class="hero-grid" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 6rem 0 5rem;
  overflow: hidden;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: rgba(34, 211, 238, 0.12);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.hero-title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
}

.gradient {
  background: linear-gradient(135deg, #22d3ee, #67e8f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.15rem;
  max-width: 560px;
  margin: 0 auto 2rem;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-lg {
  padding: 0.9rem 1.75rem;
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

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  font-family: var(--font-mono);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
