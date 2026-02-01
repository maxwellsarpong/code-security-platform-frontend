<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <a href="/" class="logo">
        <span class="logo-icon">◈</span>
        <span>SecureCode</span>
      </a>
      <nav class="links" :class="{ open: menuOpen }">
        <a href="#features">Features</a>
        <a href="#billing">Pricing</a>
        <a href="#cta">Get started</a>
      </nav>
      <div class="actions">
        <a href="/dashboard" class="btn btn-ghost">Dashboard</a>
        <a href="#billing" class="btn btn-primary">Start free trial</a>
      </div>
      <button class="menu-toggle" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
  text-decoration: none;
}

.logo:hover {
  text-decoration: none;
  color: var(--accent);
}

.logo-icon {
  color: var(--accent);
  font-size: 1.5rem;
}

.links {
  display: flex;
  gap: 2rem;
}

.links a {
  color: var(--text-muted);
  font-weight: 500;
  text-decoration: none;
}

.links a:hover {
  color: var(--accent);
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-ghost {
  color: var(--text-muted);
  background: transparent;
}

.btn-ghost:hover {
  color: var(--text);
  text-decoration: none;
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
}

.btn-primary:hover {
  background: #67e8f9;
  text-decoration: none;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text);
}

@media (max-width: 768px) {
  .links,
  .actions {
    display: none;
  }

  .links.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 4rem;
    left: 0;
    right: 0;
    background: var(--bg-elevated);
    padding: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .actions {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
