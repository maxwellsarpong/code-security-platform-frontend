<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAdmin, currentTenant, tenants, setCurrentTenant } = useAuth()
const open = ref(false)

const otherTenants = computed(() =>
  tenants.value.filter((t) => t.id !== currentTenant.value?.id && t.status === 'active')
)

function switchTenant(tenant) {
  setCurrentTenant(tenant)
  open.value = false
}

function goToAdmin() {
  open.value = false
  router.push('/admin')
}
</script>

<template>
  <div v-if="isAdmin" class="tenant-switcher">
    <button
      type="button"
      class="switcher-trigger"
      aria-haspopup="listbox"
      aria-expanded="open"
      @click="open = !open"
    >
      <span class="current-name">{{ currentTenant?.name ?? 'Select tenant' }}</span>
      <span class="chevron">▼</span>
    </button>
    <div v-if="open" class="switcher-dropdown" role="listbox">
      <div class="dropdown-section">
        <span class="dropdown-label">Switch tenant</span>
        <button
          v-for="t in otherTenants"
          :key="t.id"
          type="button"
          class="dropdown-item"
          role="option"
          @click="switchTenant(t)"
        >
          {{ t.name }}
          <span class="item-meta">{{ t.plan }}</span>
        </button>
        <button v-if="!otherTenants.length" type="button" class="dropdown-item" disabled>
          No other tenants
        </button>
      </div>
      <div class="dropdown-divider" />
      <button type="button" class="dropdown-item dropdown-item--admin" @click="goToAdmin">
        Manage all tenants →
      </button>
    </div>
    <div v-if="open" class="switcher-backdrop" aria-hidden="true" @click="open = false" />
  </div>
  <span v-else class="user-badge">{{ currentTenant?.name ?? '—' }}</span>
</template>

<style scoped>
.tenant-switcher {
  position: relative;
}

.switcher-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;
  min-width: 140px;
  justify-content: space-between;
}

.switcher-trigger:hover {
  border-color: var(--accent);
}

.chevron {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.switcher-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 220px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 50;
  padding: 0.5rem 0;
}

.dropdown-section {
  padding: 0 0.25rem;
}

.dropdown-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  padding: 0.35rem 0.5rem;
}

.dropdown-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  color: var(--text);
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}

.dropdown-item:hover:not(:disabled) {
  background: var(--bg-elevated);
}

.dropdown-item:disabled {
  color: var(--text-muted);
  cursor: default;
}

.item-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--border);
  margin: 0.25rem 0;
}

.dropdown-item--admin {
  color: var(--accent);
  font-weight: 500;
}

.switcher-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.user-badge {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.35rem 0.75rem;
  background: var(--bg-card);
  border-radius: var(--radius);
}
</style>
