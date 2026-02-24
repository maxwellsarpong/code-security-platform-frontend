import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'SecureCode – Code Security Platform' } },
  { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { title: 'Checkout – SecureCode' } },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { title: 'Sign in – SecureCode' } },
  { path: '/enterprise', name: 'enterprise', component: () => import('../views/EnterpriseView.vue'), meta: { title: 'Enterprise – SecureCode' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title || 'SecureCode'
})

export default router
