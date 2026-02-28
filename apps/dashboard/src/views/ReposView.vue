<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardAuthService from '../services/authService'
import BillingService from '../services/billingService'
import Toast from '../components/Toast.vue'

const repos = ref([])
const usageData = ref(null)
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const resolvingFindings = ref(new Set()) // Track which findings are being resolved

// Toast notification
const toast = ref({
  show: false,
  variant: 'success',
  message: ''
})

const showToast = (message, variant = 'success') => {
  toast.value = {
    show: true,
    variant,
    message
  }
}

// Issues modal
const isIssuesModalOpen = ref(false)
const selectedRepo = ref(null)

const openIssuesModal = (repo) => {
  selectedRepo.value = repo
  isIssuesModalOpen.value = true
}

const closeIssuesModal = () => {
  isIssuesModalOpen.value = false
  selectedRepo.value = null
}

// Pagination
const ITEMS_PER_PAGE = 8
const currentPage = ref(1)

const getRepoName = (url) => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1]
}

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'Recently') return 'Recently'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateStr
  }
}

const fetchRepos = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Fetch repos and usage in parallel
    const [scansRes, usageRes] = await Promise.all([
      DashboardAuthService.request('/scans', { method: 'GET' }),
      BillingService.getUserUsage().catch(() => null)
    ])
    
    usageData.value = usageRes
    
    if (!scansRes.ok) throw new Error('Failed to fetch repositories data')
    const scans = await scansRes.json()
    
    // Group scans by repo_url and get latest info for each
    const repoMap = {}
    scans.forEach(scan => {
      if (!repoMap[scan.repo_url]) {
        repoMap[scan.repo_url] = {
          repo_url: scan.repo_url,
          provider: 'GitHub', 
          lastScan: scan.created_at || 'Recently',
          riskScore: scan.risk_score || 0,
          issues: scan.findings ? scan.findings.length : 0,
          findings: scan.findings || [] 
        }
      }
    })
    
    repos.value = Object.values(repoMap)
  } catch (err) {
    console.error('Error fetching repos:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchRepos)

const filteredRepos = computed(() => {
  if (!searchQuery.value) return repos.value
  const query = searchQuery.value.toLowerCase()
  return repos.value.filter(repo => {
    const name = getRepoName(repo.repo_url).toLowerCase()
    return name.includes(query)
  })
})

const totalPages = computed(() => Math.ceil(filteredRepos.value.length / ITEMS_PER_PAGE))

const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredRepos.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const resolveFinding = async (finding) => {
  if (!finding.id) {
    showToast('Unable to resolve finding: ID missing', 'error')
    return
  }
  
  resolvingFindings.value.add(finding.id)
  try {
    const response = await DashboardAuthService.request(
      `/findings/${finding.id}/resolve`,
      { method: 'POST' }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to resolve finding' }))
      throw new Error(errorData.detail || `Error: ${response.status}`)
    }
    
    showToast('Finding resolved successfully!', 'success')
    
    // Remove resolved finding from the list
    if (selectedRepo.value && selectedRepo.value.findings) {
      selectedRepo.value.findings = selectedRepo.value.findings.filter(f => f.id !== finding.id)
      selectedRepo.value.issues = selectedRepo.value.findings.length
    }
    
    // Also update the main repos list to reflect the change
    const repoIndex = repos.value.findIndex(r => r.repo_url === selectedRepo.value?.repo_url)
    if (repoIndex !== -1) {
      repos.value[repoIndex].issues = selectedRepo.value.findings.length
      repos.value[repoIndex].findings = selectedRepo.value.findings
    }
  } catch (err) {
    console.error('Error resolving finding:', err)
    showToast(err.message || 'Failed to resolve finding', 'error')
  } finally {
    resolvingFindings.value.delete(finding.id)
  }
}
</script>

<template>
  <div class="repos-view">
    <!-- Quota usage bar -->
    <div v-if="usageData" class="tenant-context">
      <span class="context-icon">💡</span>
      You've used <strong>{{ usageData.current_month_usage || 0 }}</strong> 
      of your <strong>{{ usageData.scan_quota_limit || 0 }}</strong> monthly scans.
      <router-link to="/billing" class="link" style="margin-left: 0.5rem">Manage Billing</router-link>
    </div>

    <div class="view-header">
      <div class="header-main">
        <p class="view-desc">Connected repositories and their last scan status.</p>
      </div>
      <div class="search-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search repositories..." 
          class="search-input"
        />
      </div>
    </div>

    <div class="card table-card">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading repositories...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button type="button" class="btn btn-ghost" @click="fetchRepos">Retry</button>
      </div>

      <div v-else-if="repos.length === 0" class="empty-state">
        <p>No repositories found</p>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Provider</th>
              <th>Last Scan</th>
              <th>Risk score</th>
              <th>Open Issues</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in paginatedRepos" :key="r.repo_url">
              <td>
                <span class="repo-name">{{ getRepoName(r.repo_url) }}</span>
              </td>
              <td>{{ r.provider }}</td>
              <td class="text-muted">{{ formatDate(r.lastScan) }}</td>
              <td>
                <span class="risk-score">{{ r.riskScore.toFixed(1) }}</span>
              </td>
              <td>{{ r.issues }}</td>
              <td>
                <button 
                  type="button" 
                  class="btn btn-ghost btn-sm"
                  @click="openIssuesModal(r)"
                >
                  Resolve issue
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

    <!-- Issues Modal -->
    <div v-if="isIssuesModalOpen" class="modal-overlay" @click="closeIssuesModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedRepo ? getRepoName(selectedRepo.repo_url) : 'Issues' }}</h2>
          <button 
            type="button" 
            class="btn-close"
            @click="closeIssuesModal"
          >
            ✕
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedRepo && selectedRepo.findings.length > 0" class="findings-list">
            <div 
              v-for="finding in selectedRepo.findings" 
              :key="finding.id"
              class="finding-card"
            >
              <div class="finding-header">
                <h3>{{ finding.title }}</h3>
                <span class="severity-badge" :class="`severity-${finding.severity}`">
                  {{ finding.severity }}
                </span>
              </div>
              <div v-if="finding.file_path" class="finding-meta">
                <span class="meta-item">{{ finding.file_path }}</span>
                <span v-if="finding.line_number" class="meta-item">Line {{ finding.line_number }}</span>
              </div>
              <p v-if="finding.description" class="finding-desc">{{ finding.description }}</p>
              <button
                type="button"
                class="btn btn-primary btn-sm resolve-btn"
                :disabled="resolvingFindings.has(finding.id)"
                @click="resolveFinding(finding)"
              >
                <span v-if="resolvingFindings.has(finding.id)" class="spinner-small"></span>
                <span v-else>Resolve</span>
              </button>
            </div>
          </div>
          <div v-else class="empty-findings">
            <p>No issues found in this repository</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast 
      v-model:show="toast.show"
      :variant="toast.variant"
      :message="toast.message"
    />
  </div>
</template>

<style scoped>
.repos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.header-main {
  flex: 1;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: 0.95rem;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1), var(--shadow-md);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  transition: color var(--transition-base);
}

.search-wrapper:focus-within .search-icon {
  color: var(--accent);
}

.view-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  flex: 1;
}

.table-card {
  padding: 0;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.table-card .table-wrap {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.repo-name {
  font-weight: 600;
  color: var(--text);
}

.risk-score {
  font-weight: 700;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 1rem;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--bg-elevated);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--accent);
}

.text-muted {
  color: var(--text-muted);
}

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

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  gap: 1.25rem;
}

.loading-state p,
.error-state p,
.empty-state p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.btn-close:hover {
  color: var(--text);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.finding-card {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1rem;
  background: var(--bg-elevated);
  transition: all var(--transition-fast);
}

.finding-card:hover {
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.finding-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.finding-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
  flex: 1;
}

.severity-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.severity-critical {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.severity-high {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.severity-medium {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.severity-low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.finding-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.meta-item {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.finding-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.75rem 0;
  line-height: 1.5;
}

.resolve-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
}

.empty-findings {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}
</style>

