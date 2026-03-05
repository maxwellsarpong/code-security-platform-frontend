<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useDashboard } from '../composables/useDashboard'
import { useAuthLanding } from '../composables/useAuthLanding'

const menuOpen = ref(false)
const { theme, toggleTheme } = useTheme()
const { goToDashboard } = useDashboard()
const { logout, isAuthenticated, user, isLoggingOut } = useAuthLanding()

// Authentication state
const userName = computed(() => user.value?.name || user.value?.email?.split('@')[0] || 'User')

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  menuOpen.value = false // Close mobile menu after clicking
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to log out?')) {
    await logout()
    // Redirect is already handled if needed, or we do it here synchronously after the state is cleared
    window.location.href = '/login?logout=success'
  }
}
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">◈</span>
        <span>SecureCode</span>
      </router-link>
      <nav class="links" :class="{ open: menuOpen }">
        <button @click="scrollToSection('features')" class="nav-link">Features</button>
        <button @click="scrollToSection('metrics')" class="nav-link">Metrics</button>
        <button @click="scrollToSection('billing')" class="nav-link">Pricing</button>
        <router-link to="/login" class="nav-link">Get started</router-link>
      </nav>
      <div class="actions">
        <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <span class="icon-dark">🌙</span>
          <span class="icon-light">☀️</span>
        </button>
        
        <!-- Authenticated User UI -->
        <div v-if="isAuthenticated || isLoggingOut" class="user-section">
          <div class="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <button @click="goToDashboard" class="btn btn-primary" :disabled="isLoggingOut">Open Dashboard</button>
          <button @click="handleLogout" class="btn btn-logout" :disabled="isLoggingOut">
            {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
        
        <!-- Unauthenticated User UI -->
        <template v-else>
          <router-link to="/login" class="btn btn-ghost">Dashboard</router-link>
          <router-link to="/login" class="btn btn-primary">Start free trial</router-link>
        </template>
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
  background: rgba(10, 15, 26, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(45, 58, 79, 0.4);
  transition: all 0.3s ease;
}

.nav::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.05) 0%, transparent 100%);
  pointer-events: none;
  z-index: -1;
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
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--text);
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo:hover {
  text-decoration: none;
  color: var(--accent);
}

.logo-icon {
  color: var(--accent);
  font-size: 1.5rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover .logo-icon {
  transform: rotate(15deg);
}

.links {
  display: flex;
  gap: 2.5rem;
}

.links a,
.links button {
  color: var(--text-muted);
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: right;
}

.links a:hover {
  color: var(--accent);
}

.links a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.55rem 1.15rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.btn-ghost {
  color: var(--text-muted);
  background: transparent;
}

.btn-ghost:hover {
  color: var(--text);
  text-decoration: none;
  background: rgba(34, 211, 238, 0.05);
}

.btn-primary {
  color: var(--bg);
  background: var(--accent);
  box-shadow: 0 4px 12px rgba(34, 211, 238, 0.25);
}

.btn-primary:hover {
  background: #67e8f9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 211, 238, 0.35);
  text-decoration: none;
}

.btn-logout {
  color: var(--text-muted);
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-logout:hover {
  color: #ff4757;
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(34, 211, 238, 0.2);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--accent) 0%, #06d9ff 100%);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--bg);
  box-shadow: 0 2px 8px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  letter-spacing: 0.05em;
}

.user-avatar svg {
  color: var(--bg);
  flex-shrink: 0;
}

.user-section:hover .user-avatar {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 211, 238, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(34, 211, 238, 0.5);
}

.theme-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(34, 211, 238, 0.1);
}

.icon-light {
  display: none;
}

html.light-mode .icon-light {
  display: inline;
}

html.light-mode .icon-dark {
  display: none;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  opacity: 0.7;
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.menu-toggle.open span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.menu-toggle.open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

@media (max-width: 768px) {
  .links {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 4rem;
    left: 0;
    right: 0;
    background: var(--bg-elevated);
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    gap: 1rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .links.open {
    max-height: 400px;
  }

  .actions {
    display: none;
  }
  
  /* Show user section on mobile menu */
  .menu-toggle.open ~ .actions {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 4rem;
    right: 0;
    left: auto;
    width: auto;
    background: var(--bg-elevated);
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    gap: 0.5rem;
  }

  .menu-toggle {
    display: flex;
  }
  
  .user-section {
    flex-direction: column;
    border-left: none;
    border-top: 1px solid rgba(34, 211, 238, 0.2);
    padding-left: 0;
    padding-top: 1rem;
    width: 100%;
  }
}
</style>
