<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { isAdmin } = useAuth()

const navItems = [
  { path: '/admin', name: 'Overview', icon: '◉' },
  { path: '/admin/tenants', name: 'Tenants', icon: '◈' },
]

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="layout admin-layout">
    <aside class="sidebar">
      <router-link to="/" class="sidebar-brand">
        <span class="brand-icon">◈</span>
        <span>SecureCode</span>
      </router-link>
      <div class="admin-badge">Platform Admin</div>
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
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">← Tenant dashboard</router-link>
      </div>
    </aside>
    <div class="main-wrap">
      <header class="header">
        <h1 class="page-title">{{ route.meta.title || 'Admin' }}</h1>
        <div class="header-actions">
          <span class="user-badge">Super Admin</span>
          <a href="/" class="btn btn-ghost btn-sm">Switch to tenant view</a>
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
.admin-layout .admin-badge {
  padding: 0.35rem 1rem;
  margin: 0 0.75rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
  background: rgba(34, 211, 238, 0.1);
  border-radius: var(--radius);
  text-align: center;
}

.admin-layout .nav-item.active {
  background: rgba(34, 211, 238, 0.15);
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
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

/* Reuse same layout base - ensure same as AppLayout */
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

.nav-icon {
  font-size: 1rem;
  opacity: 0.9;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
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

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  cursor: pointer;
  background: transparent;
  color: var(--text-muted);
  text-decoration: none;
}

.btn:hover {
  color: var(--text);
}

.btn-ghost {
  border-color: var(--border);
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
</style>
