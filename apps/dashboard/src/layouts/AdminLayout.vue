<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { isAdmin, logout, isLoggingOut } = useAuth()

const navItems = [
  { path: '/admin', name: 'Overview', icon: '◉' },
  { path: '/admin/users', name: 'Users', icon: '◇' },
  { path: '/admin/scans', name: 'Platform Scans', icon: '🔍' },
  { path: '/admin/health', name: 'Platform Health', icon: '⚡' },
]

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to log out?')) {
    await logout()
  }
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
        <button 
          type="button" 
          class="logout-btn" 
          @click="handleLogout" 
          title="Logout"
          :disabled="isLoggingOut"
        >
          <svg v-if="!isLoggingOut" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
        </button>
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
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem;
  font-weight: 800;
  font-size: 1.125rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: all var(--transition-base);
}

.sidebar-brand:hover {
  color: var(--accent);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%);
  border-radius: var(--radius-md);
  color: var(--bg);
  font-size: 1.25rem;
  font-weight: 700;
}

.admin-layout .admin-badge {
  padding: 0.5rem 1rem;
  margin: 0.75rem 0.75rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--critical);
  background: var(--critical-light);
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid var(--critical);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.25rem;
  margin: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.nav-item:hover {
  color: var(--text);
  background: var(--bg-hover);
}

.nav-item.active {
  color: var(--accent);
  background: var(--accent-light);
}

.admin-layout .nav-item.active {
  background: rgba(239, 68, 68, 0.1);
}

.nav-item.active::before {
  opacity: 1;
}

.nav-icon {
  font-size: 1.15rem;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  flex: 1;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.back-link {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.back-link:hover {
  color: var(--accent);
}

.logout-btn {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: inherit;
  width: 100%;
  justify-content: flex-start;
  margin-top: 0.75rem;
}

.logout-btn:hover:not(:disabled) {
  color: #ff4757;
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  padding: 1.25rem 1.75rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-badge {
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 0.5rem 0.875rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn:hover {
  color: var(--text);
  background: var(--bg-hover);
  border-color: var(--text-secondary);
}

.btn-ghost {
  border-color: var(--border);
}

.btn-sm {
  padding: 0.5rem 0.875rem;
  font-size: 0.85rem;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow: auto;
  background: var(--bg);
}

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
