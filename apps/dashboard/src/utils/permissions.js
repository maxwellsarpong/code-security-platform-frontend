/**
 * Role-based Access Control (RBAC) Utilities
 * 
 * Roles:
 * - super_admin: Platform administrator with full system access
 * - tenant_admin: Tenant administrator with full tenant access
 * - tenant_member: Regular tenant user with limited access
 */

// Define role hierarchy (higher index = more permissions)
export const ROLES = {
  TENANT_MEMBER: 'tenant_member',
  TENANT_ADMIN: 'tenant_admin',
  SUPER_ADMIN: 'super_admin',
}

const roleHierarchy = [
  ROLES.TENANT_MEMBER,
  ROLES.TENANT_ADMIN,
  ROLES.SUPER_ADMIN,
]

/**
 * Check if user has a specific role
 */
export function hasRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false
  const userIndex = roleHierarchy.indexOf(userRole)
  const requiredIndex = roleHierarchy.indexOf(requiredRole)
  return userIndex >= requiredIndex
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRole, requiredRoles = []) {
  if (!userRole || !requiredRoles.length) return false
  return requiredRoles.some(role => hasRole(userRole, role))
}

/**
 * Define permissions for different features
 */
export const PERMISSIONS = {
  // Admin Panel
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  MANAGE_TENANTS: 'manage_tenants',
  VIEW_SYSTEM_METRICS: 'view_system_metrics',
  
  // Tenant Management
  VIEW_OVERVIEW: 'view_overview',
  VIEW_SCANS: 'view_scans',
  CREATE_SCANS: 'create_scans',
  DELETE_SCANS: 'delete_scans',
  
  // Repository Management
  VIEW_REPOS: 'view_repos',
  MANAGE_REPOS: 'manage_repos',
  
  // Billing
  VIEW_BILLING: 'view_billing',
  MANAGE_BILLING: 'manage_billing',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_USERS: 'manage_users',
}

/**
 * Role-Permission mapping
 */
const rolePermissions = {
  [ROLES.SUPER_ADMIN]: [
    // Super admin has all permissions
    PERMISSIONS.VIEW_ADMIN_PANEL,
    PERMISSIONS.MANAGE_TENANTS,
    PERMISSIONS.VIEW_SYSTEM_METRICS,
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_SCANS,
    PERMISSIONS.CREATE_SCANS,
    PERMISSIONS.DELETE_SCANS,
    PERMISSIONS.VIEW_REPOS,
    PERMISSIONS.MANAGE_REPOS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
  ],
  [ROLES.TENANT_ADMIN]: [
    // Tenant admin has all tenant-level permissions
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_SCANS,
    PERMISSIONS.CREATE_SCANS,
    PERMISSIONS.DELETE_SCANS,
    PERMISSIONS.VIEW_REPOS,
    PERMISSIONS.MANAGE_REPOS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
  ],
  [ROLES.TENANT_MEMBER]: [
    // Regular members have read access and can create scans
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_SCANS,
    PERMISSIONS.CREATE_SCANS,
    PERMISSIONS.VIEW_REPOS,
  ],
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false
  const permissions = rolePermissions[userRole] || []
  return permissions.includes(permission)
}

/**
 * Check if user has all specified permissions
 */
export function hasAllPermissions(userRole, permissions = []) {
  if (!userRole || !permissions.length) return false
  return permissions.every(permission => hasPermission(userRole, permission))
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userRole, permissions = []) {
  if (!userRole || !permissions.length) return false
  return permissions.some(permission => hasPermission(userRole, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role) {
  return rolePermissions[role] || []
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(userRole, routeMeta = {}) {
  // If no restrictions, allow access
  if (!routeMeta.requiresRole && !routeMeta.requiresPermission) {
    return true
  }
  
  // Check role requirement
  if (routeMeta.requiresRole) {
    const roles = Array.isArray(routeMeta.requiresRole) 
      ? routeMeta.requiresRole 
      : [routeMeta.requiresRole]
    
    if (!hasAnyRole(userRole, roles)) {
      return false
    }
  }
  
  // Check permission requirement
  if (routeMeta.requiresPermission) {
    const permissions = Array.isArray(routeMeta.requiresPermission)
      ? routeMeta.requiresPermission
      : [routeMeta.requiresPermission]
    
    if (!hasAnyPermission(userRole, permissions)) {
      return false
    }
  }
  
  return true
}
