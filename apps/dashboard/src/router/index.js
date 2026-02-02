import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { isPlatformAdmin } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'overview', component: () => import('../views/OverviewView.vue'), meta: { title: 'Overview' } },
      { path: 'scans', name: 'scans', component: () => import('../views/ScansView.vue'), meta: { title: 'Scans' } },
      { path: 'repos', name: 'repos', component: () => import('../views/ReposView.vue'), meta: { title: 'Repositories' } },
      { path: 'billing', name: 'billing', component: () => import('../views/BillingView.vue'), meta: { title: 'Billing' } },
      { path: 'settings', name: 'settings', component: () => import('../views/SettingsView.vue'), meta: { title: 'Settings' } },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'admin-overview', component: () => import('../views/admin/AdminOverviewView.vue'), meta: { title: 'Admin Overview' } },
      { path: 'tenants', name: 'admin-tenants', component: () => import('../views/admin/TenantListView.vue'), meta: { title: 'Tenants' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !isPlatformAdmin()) {
    return { path: '/', replace: true }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} – SecureCode` : 'SecureCode'
})

export default router
