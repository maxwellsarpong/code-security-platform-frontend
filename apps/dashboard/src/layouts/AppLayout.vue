<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import TenantSwitcher from '../components/TenantSwitcher.vue'

const route = useRoute()
const { isAdmin } = useAuth()

const navItems = [
  { path: '/', name: 'Overview', icon: '◉' },
  { path: '/scans', name: 'Scans', icon: '▸' },
  { path: '/repos', name: 'Repositories', icon: '◇' },
  { path: '/billing', name: 'Billing', icon: '◈' },
  { path: '/settings', name: 'Settings', icon: '⚙' },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <a href="/" class="sidebar-brand">
        <span class="brand-icon">◈</span>
        <span>SecureCode</span>
      </a>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="nav-item nav-item--admin"
          :class="{ active: route.path.startsWith('/admin') }"
        >
          <span class="nav-icon">⚙</span>
          <span class="nav-text">Admin</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <a href="/" class="back-link">← Landing</a>
      </div>
    </aside>
    <div class="main-wrap">
      <header class="header">
        <h1 class="page-title">{{ route.meta.title || 'Dashboard' }}</h1>
        <div class="header-actions">
          <TenantSwitcher />
          <button type="button" class="btn-icon" aria-label="Notifications">🔔</button>
        </div>
      </header>
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}

.sidebar-brand:hover {
  color: var(--accent);
  text-decoration: none;
}

.brand-icon {
  color: var(--accent);
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: var(--radius);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}

.nav-item:hover {
  color: var(--text);
  background: var(--bg-card);
  text-decoration: none;
}

.nav-item.active {
  color: var(--accent);
  background: rgba(34, 211, 238, 0.1);
}

.nav-item--admin {
  margin-top: 0.5rem;
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
}

.nav-icon {
  font-size: 1rem;
  opacity: 0.9;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.back-link {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--accent);
  text-decoration: none;
}

.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-badge {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.35rem 0.75rem;
  background: var(--bg-card);
  border-radius: var(--radius);
}

.btn-icon {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-muted);
}

.btn-icon:hover {
  color: var(--text);
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    padding: 0;
  }

  .sidebar-brand span:not(.brand-icon),
  .nav-text,
  .sidebar-footer {
    display: none;
  }

  .sidebar-brand {
    justify-content: center;
    padding: 1rem;
  }

  .nav-item {
    justify-content: center;
    padding: 0.75rem;
  }

  .nav-icon {
    margin: 0;
  }
}
</style>
