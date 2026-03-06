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
  currentUser: storedUser,
  currentTenant: null,
  tenants: [],
  isAuthenticated: DashboardAuthService.isAuthenticated(),
  isLoggingOut: false
})

// Initialize current tenant to first active tenant
if (!state.currentTenant && state.tenants.length) {
  state.currentTenant = state.tenants[0]
}

// Listen for cross-tab or cross-app changes to localStorage
window.addEventListener('storage', (event) => {
  // Skip if a manual logout is already in progress - it will handle its own cleanup
  if (state.isLoggingOut) return

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

  async function logout() {
    state.isLoggingOut = true

    // Artificial delay to allow UI to show feedback and avoid jarring jump
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Clear localStorage JWT token
    DashboardAuthService.logout()

    // Clear state
    state.currentUser = null
    state.currentTenant = null
    state.isAuthenticated = false
    // Note: we leave isLoggingOut true until the page redirects to landing

    // Redirect to landing page login using environment variable to avoid hardcoded ports
    const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173'
    window.location.href = `${landingUrl}/login?logout=success`
  }

  return {
    // State
    currentUser: computed(() => state.currentUser),
    currentTenant: computed(() => state.currentTenant),
    tenants: computed(() => state.tenants),
    isAuthenticated: computed(() => state.isAuthenticated),
    isLoggingOut: computed(() => state.isLoggingOut),

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
