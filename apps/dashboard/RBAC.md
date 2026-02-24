# Role-Based Access Control (RBAC) Documentation

## Overview

The SecurityCode dashboard implements a comprehensive Role-Based Access Control (RBAC) system that manages access to different features and views based on user roles and permissions.

## Architecture

The RBAC system consists of three main components:

1. **Permissions System** (`src/utils/permissions.js`)
2. **Authentication Composable** (`src/composables/useAuth.js`)
3. **Route Guards** (`src/router/index.js`)

## Roles

The system supports three hierarchical roles:

### 1. Super Admin (`super_admin`)
- **Full system access** including the admin panel
- Can manage all tenants across the platform
- Access to system-wide metrics and analytics
- Can perform all actions available to lower roles

**Use Case**: Platform administrators who manage the entire system

### 2. Tenant Admin (`tenant_admin`)
- **Full access to their tenant's dashboard**
- Can manage tenant settings, billing, and users
- Can perform all operations within their tenant scope
- **Cannot access** the admin panel or other tenants' data

**Use Case**: Organization administrators managing their own security scans

### 3. Tenant Member (`tenant_member`)
- **Read-only access** to most tenant features
- Can view scans, repositories, and overview
- Can create new scans
- **Cannot access** billing, settings, or user management

**Use Case**: Developers and team members who need to view security reports

## Permissions

Permissions are granular capabilities assigned to roles. They include:

### Admin Panel Permissions
- `VIEW_ADMIN_PANEL` - Access the admin panel
- `MANAGE_TENANTS` - Create, update, delete tenants
- `VIEW_SYSTEM_METRICS` - View platform-wide analytics

### Tenant Dashboard Permissions
- `VIEW_OVERVIEW` - View tenant overview/dashboard
- `VIEW_SCANS` - View security scans
- `CREATE_SCANS` - Create new security scans
- `DELETE_SCANS` - Delete existing scans
- `VIEW_REPOS` - View repositories
- `MANAGE_REPOS` - Add/remove repositories
- `VIEW_BILLING` - View billing information
- `MANAGE_BILLING` - Update billing details
- `VIEW_SETTINGS` - View tenant settings
- `MANAGE_SETTINGS` - Modify tenant settings
- `MANAGE_USERS` - Add/remove/modify users

## Permission Matrix

| Permission | Super Admin | Tenant Admin | Tenant Member |
|-----------|-------------|--------------|---------------|
| VIEW_ADMIN_PANEL | ✅ | ❌ | ❌ |
| MANAGE_TENANTS | ✅ | ❌ | ❌ |
| VIEW_SYSTEM_METRICS | ✅ | ❌ | ❌ |
| VIEW_OVERVIEW | ✅ | ✅ | ✅ |
| VIEW_SCANS | ✅ | ✅ | ✅ |
| CREATE_SCANS | ✅ | ✅ | ✅ |
| DELETE_SCANS | ✅ | ✅ | ❌ |
| VIEW_REPOS | ✅ | ✅ | ✅ |
| MANAGE_REPOS | ✅ | ✅ | ❌ |
| VIEW_BILLING | ✅ | ✅ | ❌ |
| MANAGE_BILLING | ✅ | ✅ | ❌ |
| VIEW_SETTINGS | ✅ | ✅ | ❌ |
| MANAGE_SETTINGS | ✅ | ✅ | ❌ |
| MANAGE_USERS | ✅ | ✅ | ❌ |

## Usage

### In Components

```vue
<script setup>
import { useAuth, PERMISSIONS, ROLES } from '@/composables/useAuth'

const { 
  isSuperAdmin, 
  isTenantAdmin, 
  isTenantMember,
  can,
  canAny,
  hasRoleLevel 
} = useAuth()

// Check specific permission
if (can(PERMISSIONS.MANAGE_BILLING)) {
  // Show billing management UI
}

// Check multiple permissions
if (canAny([PERMISSIONS.VIEW_BILLING, PERMISSIONS.MANAGE_BILLING])) {
  // Show billing section
}

// Check role level
if (hasRoleLevel(ROLES.TENANT_ADMIN)) {
  // Show admin features
}
</script>

<template>
  <!-- Conditional rendering based on permissions -->
  <button v-if="can(PERMISSIONS.DELETE_SCANS)" @click="deleteScan">
    Delete Scan
  </button>

  <!-- Conditional rendering based on role -->
  <div v-if="isSuperAdmin">
    <router-link to="/admin">Admin Panel</router-link>
  </div>
</template>
```

### In Router

Routes are automatically protected based on metadata:

```javascript
{
  path: '/billing',
  component: BillingView,
  meta: {
    requiresAuth: true,
    requiresRole: [ROLES.SUPER_ADMIN, ROLES.TENANT_ADMIN],
    requiresPermission: PERMISSIONS.VIEW_BILLING
  }
}
```

### Direct Permission Checks

```javascript
import { hasPermission, hasRole } from '@/utils/permissions'

// Check if user has a permission
if (hasPermission(userRole, PERMISSIONS.CREATE_SCANS)) {
  // Allow scan creation
}

// Check if user has a role level
if (hasRole(userRole, ROLES.TENANT_ADMIN)) {
  // User is at least a tenant admin
}
```

## Testing RBAC

The dashboard includes a **Role Switcher** component in the header (marked with "DEMO" badge) that allows you to test different role permissions:

1. Click on the role switcher in the top-right corner
2. Select a different role from the dropdown
3. Observe how the navigation and available features change

**Note**: This is for demonstration purposes only. In production, roles will be assigned by the backend authentication system.

## Integration with Backend Authentication

The current implementation uses mock data for demonstration. When integrating with your backend:

### 1. Update the `useAuth` composable

Replace the mock `currentUser` with real user data from your authentication API:

```javascript
// In src/composables/useAuth.js
const state = reactive({
  currentUser: null,  // Will be populated from API
  currentTenant: null,
  tenants: [],
  isAuthenticated: false,
})

async function fetchCurrentUser() {
  const response = await fetch('/api/auth/me')
  const user = await response.json()
  state.currentUser = user
  state.isAuthenticated = true
}
```

### 2. Update the router guard

Add authentication check in the router:

```javascript
router.beforeEach(async (to, from) => {
  // Check if user is authenticated
  if (to.meta.requiresAuth && !state.isAuthenticated) {
    return { path: '/login', replace: true }
  }
  
  // ... rest of authorization checks
})
```

### 3. Backend API Requirements

Your backend should return user objects with the following structure:

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "tenant_admin",  // or "super_admin", "tenant_member"
  "tenant_id": "tenant-id"
}
```

## Security Considerations

1. **Client-side checks are not secure** - Always validate permissions on the backend
2. The RBAC system on the frontend is for **UX purposes only** (hiding/showing UI elements)
3. **Never trust client-side authorization** - Every API endpoint must validate permissions
4. Always verify user roles and permissions on the server before performing actions

## Future Enhancements

Potential improvements to the RBAC system:

1. **Custom Permissions**: Allow tenants to define custom roles with specific permission sets
2. **Resource-level Permissions**: Permissions tied to specific resources (e.g., specific repositories)
3. **Permission Groups**: Group related permissions for easier management
4. **Audit Logging**: Track permission changes and access attempts
5. **Time-based Access**: Temporary permission grants with expiration

## Files Reference

- `src/utils/permissions.js` - Permission definitions and checking logic
- `src/composables/useAuth.js` - Authentication state and permission helpers
- `src/router/index.js` - Route guards and protection
- `src/components/RoleSwitcher.vue` - Demo role switching component
- `src/views/UnauthorizedView.vue` - Access denied page
- `apps/dashboard/RBAC.md` - This documentation

## Questions?

For questions about the RBAC implementation or to report issues, please contact the development team.
