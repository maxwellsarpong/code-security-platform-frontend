<script setup>
</script>

<template>
  <div class="app">
    <header class="nav">
      <a href="/" class="logo">◈ SecureCode</a>
      <span class="nav-label">Dashboard</span>
    </header>
    <main class="main">
      <div class="placeholder">
        <h1>Dashboard</h1>
        <p>Platform dashboard will live here. Build out scans, repos, billing, and settings.</p>
        <a href="/" class="link">← Back to landing</a>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0f1a;
  color: #f1f5f9;
  font-family: system-ui, sans-serif;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #2d3a4f;
}

.logo {
  font-weight: 700;
  color: #22d3ee;
  text-decoration: none;
}

.nav-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.placeholder {
  text-align: center;
  max-width: 420px;
}

.placeholder h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.placeholder p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.link {
  color: #22d3ee;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
