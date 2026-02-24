<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, PERMISSIONS } from '../composables/useAuth'
import { useLanding } from '../composables/useLanding'
import TenantSwitcher from '../components/TenantSwitcher.vue'
import RoleSwitcher from '../components/RoleSwitcher.vue'

const route = useRoute()
const { isSuperAdmin, can, logout } = useAuth()
const { goToLanding } = useLanding()

const allNavItems = [
  { path: '/', name: 'Overview', icon: '◉', permission: PERMISSIONS.VIEW_OVERVIEW },
  { path: '/scans', name: 'Scans', icon: '▸', permission: PERMISSIONS.VIEW_SCANS },
  { path: '/repos', name: 'Repositories', icon: '◇', permission: PERMISSIONS.VIEW_REPOS },
  { path: '/billing', name: 'Billing', icon: '◈', permission: PERMISSIONS.VIEW_BILLING },
  { path: '/settings', name: 'Settings', icon: '⚙', permission: PERMISSIONS.VIEW_SETTINGS },
]

// Filter navigation items based on user permissions
const navItems = computed(() => {
  return allNavItems.filter(item => !item.permission || can(item.permission))
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  if (confirm('Are you sure you want to log out?')) {
    logout()
  }
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
          v-if="isSuperAdmin"
          to="/admin"
          class="nav-item nav-item--admin"
          :class="{ active: route.path.startsWith('/admin') }"
        >
          <span class="nav-icon">⚡</span>
          <span class="nav-text">Admin Panel</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <a href="#" class="back-link" @click.prevent="goToLanding">← Landing</a>
        <button type="button" class="logout-btn" @click="handleLogout" title="Logout">🚪 Logout</button>
      </div>
    </aside>
    <div class="main-wrap">
      <header class="header">
        <h1 class="page-title">{{ route.meta.title || 'Dashboard' }}</h1>
        <div class="header-actions">
          <RoleSwitcher />
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
  width: 260px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg) 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: inset -1px 0 0 rgba(6, 182, 212, 0.1);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.75rem;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border-light);
  transition: all var(--transition-base);
  letter-spacing: -0.02em;
}

.sidebar-brand:hover {
  color: var(--accent);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--accent) 0%, #00d9ff 100%);
  border-radius: var(--radius-md);
  color: var(--bg);
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
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
  padding: 0.85rem 1.25rem;
  margin: 0.35rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all var(--transition-base);
  position: relative;
  border: 1px solid transparent;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent-dim) 100%);
  border-radius: 0 3px 3px 0;
  opacity: 0;
  transition: all var(--transition-base);
}

.nav-item:hover {
  color: var(--text);
  background: rgba(6, 182, 212, 0.08);
  border-color: var(--border-accent);
}

.nav-item.active {
  color: var(--accent);
  background: var(--accent-light);
  border-color: var(--border-accent);
}

.nav-item.active::before {
  opacity: 1;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}

.nav-item--admin {
  margin-top: 0.75rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
}

.logout-btn:hover {
  color: #ff4757;
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
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
  gap: 1.5rem;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: var(--text);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.btn-icon {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.65rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.btn-icon:hover {
  color: var(--accent);
  background: var(--bg-hover);
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
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
