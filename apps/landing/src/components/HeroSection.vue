<script setup>
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
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
        <router-link to="/login" class="btn btn-primary btn-lg">Start free trial</router-link>
        <button @click="scrollToSection('process')" class="btn btn-outline btn-lg" type="button">See how it works</button>
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
  padding: 8rem 0 6rem;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, transparent 50%);
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(8, 145, 178, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 8s ease-in-out infinite reverse;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  text-align: center;
  z-index: 1;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(34, 211, 238, 0.1);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(34, 211, 238, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

.gradient {
  background: linear-gradient(135deg, #22d3ee, #67e8f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-primary:hover {
  background: #67e8f9;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(34, 211, 238, 0.4);
  text-decoration: none;
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-outline {
  color: var(--accent);
  border: 2px solid var(--accent);
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-outline:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: #67e8f9;
  color: #67e8f9;
  transform: translateY(-2px);
  text-decoration: none;
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.2);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat {
  text-align: center;
  padding: 1.25rem 1.75rem;
  border-radius: var(--radius);
  background: rgba(34, 211, 238, 0.05);
  border: 1px solid rgba(34, 211, 238, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.stat:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.2);
  transform: translateY(-4px);
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--accent);
  font-family: var(--font-mono);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
