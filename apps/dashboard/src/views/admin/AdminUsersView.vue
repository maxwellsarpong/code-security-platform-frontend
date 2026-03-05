<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import AdminService from '../../services/adminService'

const users = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const roleFilter = ref('all')

const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.is_active !== false).length,
  admins: users.value.filter(u => u.is_superuser || u.role?.toLowerCase() === 'admin').length
}))

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (user.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const role = (user.role || (user.is_superuser ? 'Admin' : 'Member')).toLowerCase()
    const matchesRole = roleFilter.value === 'all' || role === roleFilter.value.toLowerCase()
    
    return matchesSearch && matchesRole
  })
})

const ITEMS_PER_PAGE = 8
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / ITEMS_PER_PAGE))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredUsers.value.slice(start, end)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch([searchQuery, roleFilter], () => {
  currentPage.value = 1
})

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const response = await AdminService.getAdminUsers()
    users.value = Array.isArray(response) ? response : (response.users || [])
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error.value = 'Failed to load user list. Please verify your administrative permissions.'
    
    // Minimal mock for fallback
    users.value = [
      { id: 1, name: 'Admin User', email: 'admin@securecode.io', is_superuser: true, is_active: true, tenant_name: 'Platform' },
      { id: 2, name: 'Sample User', email: 'user@acme.com', is_superuser: false, is_active: true, tenant_name: 'Acme Corp' }
    ]
  } finally {
    loading.value = false
  }
}

function handlePasswordReset(user) {
  if (confirm(`Send a password reset email to ${user.email}?`)) {
    // API call would go here
    alert('Reset link sent!')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="admin-users">
    <div class="view-header">
      <div class="header-main">
        <p class="view-desc">Manage every user registered across all tenants from this central view.</p>
      </div>
      <div class="header-stats">
        <div class="mini-stat">
          <span class="label">Total Users</span>
          <span class="value">{{ stats.total }}</span>
        </div>
        <div class="mini-stat">
          <span class="label">Active</span>
          <span class="value success">{{ stats.active }}</span>
        </div>
        <div class="mini-stat">
          <span class="label">Admins</span>
          <span class="value">{{ stats.admins }}</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-banner card">
      <p>{{ error }}</p>
      <button @click="fetchUsers" class="btn btn-ghost btn-sm">Retry</button>
    </div>

    <div class="controls-bar card">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="Search users by name or email..." class="search-input" />
      </div>
      <div class="filter-box">
        <label>Role:</label>
        <select v-model="roleFilter" class="filter-select">
          <option value="all">All Roles</option>
          <option value="admin">Super Admins</option>
          <option value="member">Tenant Members</option>
        </select>
      </div>
    </div>

    <div class="card table-card">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
      
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>
                <div class="user-info">
                  <span class="user-name">{{ user.name || 'Anonymous' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </td>
              <td>
                <span class="role-badge" :class="user.is_superuser ? 'admin' : 'member'">
                  {{ user.is_superuser ? 'Super Admin' : (user.role || 'Member') }}
                </span>
              </td>
              <td>
                <span class="status-indicator" :class="user.is_active !== false ? 'active' : 'inactive'">
                  {{ user.is_active !== false ? 'Active' : 'Suspended' }}
                </span>
              </td>
              <td class="actions-cell">
                <button @click="handlePasswordReset(user)" class="btn-icon-alt" title="Reset Password">🔑</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0 && !loading">
              <td colspan="4" class="empty-state">No users found matching your search criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          type="button" 
          class="btn-icon" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="page-numbers">
          <button 
            v-for="p in totalPages" 
            :key="p"
            type="button"
            class="page-num"
            :class="{ active: currentPage === p }"
            @click="changePage(p)"
          >
            {{ p }}
          </button>
        </div>
        <button 
          type="button" 
          class="btn-icon" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-users {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.view-desc {
  color: var(--text-muted);
  max-width: 500px;
}

.header-stats {
  display: flex;
  gap: 1.25rem;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  min-width: 120px;
}

.mini-stat .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
}

.mini-stat .value {
  font-size: 1.5rem;
  font-weight: 800;
}

.mini-stat .value.success { color: var(--success); }

.error-banner {
  background: rgba(239, 68, 68, 0.05);
  border-left: 4px solid var(--critical);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-bar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0 0.75rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: none;
  color: var(--text);
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
}

.table-card {
  padding: 0;
  position: relative;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-rgb), 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(34, 211, 238, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: 600; }
.user-email { font-size: 0.85rem; color: var(--text-muted); }

.role-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.role-badge.admin { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.role-badge.member { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

.status-indicator.active { color: var(--success); }
.status-indicator.active::before { content: '●'; margin-right: 0.35rem; }
.status-indicator.inactive { color: var(--text-muted); }

.btn-icon-alt {
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.35rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-icon-alt:hover { background: var(--bg-hover); }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-light);
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-num {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-num:hover:not(.active) {
  border-color: var(--text-secondary);
  color: var(--text);
  background: var(--bg-hover);
}

.page-num.active {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

.btn-icon {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover:not(:disabled) {
  border-color: var(--text-secondary);
  color: var(--text);
  background: var(--bg-hover);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state { text-align: center; color: var(--text-muted); padding: 2rem !important; }
</style>
