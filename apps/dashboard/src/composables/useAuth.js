import { reactive, computed } from 'vue'
import DashboardAuthService from '../services/authService'
import {
  ROLES,
  PERMISSIONS,
  hasRole,
  hasPermission,
  hasAnyPermission,
  canAccessRoute,
  getRolePermissions
} from '../utils/permissions'

// Helper to deduce role since backend uses `is_superuser` but no explicit `role` field
function normalizeUser(user) {
  if (!user) return null;
  const role = user.role || (user.is_superuser ? ROLES.SUPER_ADMIN : ROLES.TENANT_ADMIN);
  return { ...user, role };
}

// Get stored user from localStorage or use mock data
const storedUser = normalizeUser(DashboardAuthService.getUser())

// Shared auth/tenant state (multi-tenant + admin)
const state = reactive({
  currentUser: storedUser || {
    id: 'f2f6e9ec-5d7b-44dc-a0dc-0ee5b29144f9',
    email: 'admin@securecode.io',
    name: 'Platform Admin',
    role: ROLES.SUPER_ADMIN, // super_admin | tenant_admin | tenant_member
  },
  currentTenant: null,
  tenants: [
    { id: 't-1', name: 'Acme Corp', slug: 'acme-corp', plan: 'Team', status: 'active', usersCount: 8, createdAt: '2024-06-01' },
    { id: 't-2', name: 'Globex Inc', slug: 'globex-inc', plan: 'Enterprise', status: 'active', usersCount: 42, createdAt: '2024-07-15' },
    { id: 't-3', name: 'Initech', slug: 'initech', plan: 'Starter', status: 'active', usersCount: 3, createdAt: '2024-09-20' },
    { id: 't-4', name: 'Umbrella Labs', slug: 'umbrella-labs', plan: 'Team', status: 'suspended', usersCount: 12, createdAt: '2024-08-10' },
  ],
  isAuthenticated: DashboardAuthService.isAuthenticated(),
})

// Initialize current tenant to first active tenant
if (!state.currentTenant && state.tenants.length) {
  state.currentTenant = state.tenants[0]
}

// Listen for cross-tab or cross-app changes to localStorage
window.addEventListener('storage', (event) => {
  if (event.key === 'auth_token' || event.key === 'auth_user' || !event.key) {
    state.isAuthenticated = DashboardAuthService.isAuthenticated()
    const rawStoredUser = DashboardAuthService.getUser()
    if (rawStoredUser) {
      state.currentUser = normalizeUser(rawStoredUser)
    } else {
      state.currentUser = null
      state.currentTenant = null
    }
  }
})

export function useAuth() {
  // Role checks
  const isSuperAdmin = computed(() => state.currentUser?.role === ROLES.SUPER_ADMIN)
  const isTenantAdmin = computed(() => state.currentUser?.role === ROLES.TENANT_ADMIN)
  const isTenantMember = computed(() => state.currentUser?.role === ROLES.TENANT_MEMBER)

  // Legacy compatibility
  const isAdmin = computed(() => isSuperAdmin.value)
  const isAuthenticated = computed(() => DashboardAuthService.isAuthenticated())

  const currentTenantName = computed(() => state.currentTenant?.name ?? '—')
  const currentTenantSlug = computed(() => state.currentTenant?.slug ?? '')
  const userRole = computed(() => state.currentUser?.role)

  // Permission checking functions
  function can(permission) {
    return hasPermission(state.currentUser?.role, permission)
  }

  function canAny(permissions) {
    return hasAnyPermission(state.currentUser?.role, permissions)
  }

  function hasRoleLevel(role) {
    return hasRole(state.currentUser?.role, role)
  }

  function canAccess(routeMeta) {
    return canAccessRoute(state.currentUser?.role, routeMeta)
  }

  function getUserPermissions() {
    return getRolePermissions(state.currentUser?.role)
  }

  // Tenant management
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

  // User management (for demo/testing - will be replaced by backend auth)
  function setUserRole(role) {
    if (Object.values(ROLES).includes(role)) {
      state.currentUser.role = role
    }
  }

  function login(user) {
    state.currentUser = normalizeUser(user)
    state.isAuthenticated = true
  }

  function logout() {
    // Clear localStorage JWT token
    DashboardAuthService.logout()

    // Clear state
    state.currentUser = null
    state.currentTenant = null
    state.isAuthenticated = false

    // Redirect to landing page login (same origin now)
    window.location.href = '/login?logout=success'
  }

  return {
    // State
    currentUser: computed(() => state.currentUser),
    currentTenant: computed(() => state.currentTenant),
    tenants: computed(() => state.tenants),
    isAuthenticated: computed(() => state.isAuthenticated),

    // Role checks
    isSuperAdmin,
    isTenantAdmin,
    isTenantMember,
    isAdmin, // Legacy compatibility
    userRole,

    // Tenant info
    currentTenantName,
    currentTenantSlug,

    // Permission checks
    can,
    canAny,
    hasRoleLevel,
    canAccess,
    getUserPermissions,

    // Tenant management
    setCurrentTenant,
    getTenantById,
    updateTenantStatus,
    addTenant,

    // User management
    setUserRole,
    login,
    logout,

    // Exports for backward compatibility
    isPlatformAdmin,
  }
}

// Export standalone functions for use in router and other contexts
export function isPlatformAdmin() {
  return state.currentUser?.role === ROLES.SUPER_ADMIN
}

export function getUserRole() {
  return state.currentUser?.role
}

export function checkPermission(permission) {
  return hasPermission(state.currentUser?.role, permission)
}

// Export ROLES and PERMISSIONS for easy access
export { ROLES, PERMISSIONS }
