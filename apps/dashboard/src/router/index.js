import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { getUserRole } from '../composables/useAuth'
import DashboardAuthService from '../services/authService'
import { ROLES, PERMISSIONS, canAccessRoute } from '../utils/permissions'

const routes = [
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import('../views/OverviewView.vue'),
        meta: {
          title: 'Overview',
          requiresPermission: PERMISSIONS.VIEW_OVERVIEW
        }
      },
      {
        path: 'scans',
        name: 'scans',
        component: () => import('../views/ScansView.vue'),
        meta: {
          title: 'Scans',
          requiresPermission: PERMISSIONS.VIEW_SCANS
        }
      },
      {
        path: 'repos',
        name: 'repos',
        component: () => import('../views/ReposView.vue'),
        meta: {
          title: 'Repositories',
          requiresPermission: PERMISSIONS.VIEW_REPOS
        }
      },
      {
        path: 'billing',
        name: 'billing',
        component: () => import('../views/BillingView.vue'),
        meta: {
          title: 'Billing',
          requiresPermission: PERMISSIONS.VIEW_BILLING,
          requiresRole: [ROLES.SUPER_ADMIN, ROLES.TENANT_ADMIN]
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: {
          title: 'Settings',
          requiresPermission: PERMISSIONS.VIEW_SETTINGS,
          requiresRole: [ROLES.SUPER_ADMIN, ROLES.TENANT_ADMIN]
        }
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      requiresRole: ROLES.SUPER_ADMIN,
      requiresPermission: PERMISSIONS.VIEW_ADMIN_PANEL
    },
    children: [
      {
        path: '',
        name: 'admin-overview',
        component: () => import('../views/admin/AdminOverviewView.vue'),
        meta: {
          title: 'Admin Overview',
          requiresPermission: PERMISSIONS.VIEW_SYSTEM_METRICS
        }
      },
      {
        path: 'scans',
        name: 'admin-scans',
        component: () => import('../views/admin/PlatformScansView.vue'),
        meta: {
          title: 'Platform Scans',
          requiresPermission: PERMISSIONS.MANAGE_TENANTS
        }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/admin/AdminUsersView.vue'),
        meta: {
          title: 'User Management',
          requiresPermission: PERMISSIONS.VIEW_ADMIN_PANEL
        }
      },
      {
        path: 'health',
        name: 'admin-health',
        component: () => import('../views/admin/SystemHealthView.vue'),
        meta: {
          title: 'Platform Health',
          requiresPermission: PERMISSIONS.VIEW_SYSTEM_METRICS
        }
      },
    ],
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { title: 'Unauthorized' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/app/'),
  routes,
})

// Navigation guard for authentication and authorization
router.beforeEach((to, from) => {
  // Check if user is authenticated
  const isAuthenticated = DashboardAuthService.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth !== false

  // If route requires auth and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Redirect to landing page login, preserving query params like logout=success
    const landingUrl = import.meta.env.VITE_LANDING_URL || 'https://code-security-platform-frontend-lan.vercel.app'
    const queryStr = window.location.search
    window.location.href = `${landingUrl}/login${queryStr}`
    return false
  }

  // If user is authenticated, validate they still have access
  if (isAuthenticated && requiresAuth) {
    const userRole = getUserRole()

    // Check if user has access to the route based on role and permissions
    if (to.meta && !canAccessRoute(userRole, to.meta)) {
      console.warn(`Access denied to ${to.path} for role ${userRole}`)

      // If trying to access admin area without permission, redirect to dashboard
      if (to.path.startsWith('/admin')) {
        return { path: '/', replace: true }
      }

      // Otherwise redirect to unauthorized page
      return { path: '/unauthorized', replace: true }
    }
  }

  // Allow navigation
  return true
})

// Update page title after navigation
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} – SecureCode` : 'SecureCode'
})

export default router
