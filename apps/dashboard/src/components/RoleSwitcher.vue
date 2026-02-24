<script setup>
import { ref } from 'vue'
import { useAuth, ROLES } from '../composables/useAuth'

const { currentUser, setUserRole, userRole } = useAuth()
const isOpen = ref(false)

const roles = [
  { value: ROLES.SUPER_ADMIN, label: 'Super Admin', description: 'Full system access' },
  { value: ROLES.TENANT_ADMIN, label: 'Tenant Admin', description: 'Tenant management access' },
  { value: ROLES.TENANT_MEMBER, label: 'Tenant Member', description: 'Read-only access' },
]

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectRole = (role) => {
  setUserRole(role)
  isOpen.value = false
}

const getCurrentRoleLabel = () => {
  const role = roles.find(r => r.value === userRole.value)
  return role?.label || 'Unknown Role'
}

// Close dropdown when clicking outside
const closeOnClickOutside = (event) => {
  if (!event.target.closest('.role-switcher')) {
    isOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', closeOnClickOutside)
}
</script>

<template>
  <div class="role-switcher">
    <button 
      type="button" 
      class="switcher-button" 
      @click="toggleDropdown"
      :class="{ active: isOpen }"
    >
      <div class="role-info">
        <span class="role-label">{{ getCurrentRoleLabel() }}</span>
        <span class="demo-badge">DEMO</span>
      </div>
      <span class="chevron">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown">
        <div class="dropdown-header">
          <span class="header-title">Switch Role (Demo)</span>
        </div>
        <div class="dropdown-list">
          <button
            v-for="role in roles"
            :key="role.value"
            type="button"
            class="dropdown-item"
            :class="{ active: userRole === role.value }"
            @click="selectRole(role.value)"
          >
            <div class="item-content">
              <span class="item-label">{{ role.label }}</span>
              <span class="item-description">{{ role.description }}</span>
            </div>
            <span v-if="userRole === role.value" class="check-icon">✓</span>
          </button>
        </div>
        <div class="dropdown-footer">
          <span class="footer-note">For testing RBAC functionality</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.role-switcher {
  position: relative;
}

.switcher-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.85rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s;
  min-width: 180px;
}

.switcher-button:hover {
  border-color: var(--accent);
  background: var(--bg-elevated);
}

.switcher-button.active {
  border-color: var(--accent);
}

.role-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.role-label {
  font-weight: 600;
  color: var(--text);
}

.demo-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  background: rgba(250, 204, 21, 0.2);
  color: var(--warning);
  border-radius: 3px;
  letter-spacing: 0.05em;
}

.chevron {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: transform 0.15s;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}

.header-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.dropdown-list {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--bg-elevated);
}

.dropdown-item.active {
  background: rgba(34, 211, 238, 0.08);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.item-description {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.check-icon {
  color: var(--accent);
  font-weight: bold;
}

.dropdown-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
}

.footer-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
