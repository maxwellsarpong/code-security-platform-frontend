import { reactive, computed } from 'vue'

// Shared auth/tenant state (multi-tenant + admin)
const state = reactive({
  currentUser: {
    id: 'u-1',
    email: 'admin@securecode.io',
    name: 'Platform Admin',
    role: 'admin', // 'admin' | 'tenant_admin' | 'member'
  },
  currentTenant: null,
  tenants: [
    { id: 't-1', name: 'Acme Corp', slug: 'acme-corp', plan: 'Team', status: 'active', usersCount: 8, createdAt: '2024-06-01' },
    { id: 't-2', name: 'Globex Inc', slug: 'globex-inc', plan: 'Enterprise', status: 'active', usersCount: 42, createdAt: '2024-07-15' },
    { id: 't-3', name: 'Initech', slug: 'initech', plan: 'Starter', status: 'active', usersCount: 3, createdAt: '2024-09-20' },
    { id: 't-4', name: 'Umbrella Labs', slug: 'umbrella-labs', plan: 'Team', status: 'suspended', usersCount: 12, createdAt: '2024-08-10' },
  ],
})

// Initialize current tenant to first active tenant
if (!state.currentTenant && state.tenants.length) {
  state.currentTenant = state.tenants[0]
}

export function useAuth() {
  const isAdmin = computed(() => state.currentUser?.role === 'admin')
  const currentTenantName = computed(() => state.currentTenant?.name ?? '—')
  const currentTenantSlug = computed(() => state.currentTenant?.slug ?? '')

  function setCurrentTenant(tenant) {
    state.currentTenant = tenant
  }

  function getTenantById(id) {
    return state.tenants.find((t) => t.id === id)
  }

  function updateTenantStatus(tenantId, status) {
    const t = state.tenants.find((x) => x.id === tenantId)
    if (t) t.status = status
  }

  function addTenant(tenant) {
    state.tenants.push({ ...tenant, id: `t-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) })
  }

  return {
    currentUser: computed(() => state.currentUser),
    currentTenant: computed(() => state.currentTenant),
    tenants: computed(() => state.tenants),
    isAdmin,
    currentTenantName,
    currentTenantSlug,
    setCurrentTenant,
    getTenantById,
    updateTenantStatus,
    addTenant,
    isPlatformAdmin,
  }
}

export function isPlatformAdmin() {
  return state.currentUser?.role === 'admin'
}
