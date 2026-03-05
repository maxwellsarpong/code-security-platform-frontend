<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import AdminService from '../../services/adminService'
import Sheet from '../../components/Sheet.vue'

const scans = ref([])
const loading = ref(true)
const error = ref(null)

const isDetailOpen = ref(false)
const selectedScan = ref(null)

const filter = ref('all')

// Filtering Logic
const filteredScans = computed(() => {
  if (filter.value === 'completed') return scans.value.filter(s => s.status?.toLowerCase() === 'completed')
  if (filter.value === 'failed') return scans.value.filter(s => s.status?.toLowerCase() === 'failed')
  if (filter.value === 'running') return scans.value.filter(s => s.status?.toLowerCase() === 'pending')
  return scans.value
})

// Pagination
const ITEMS_PER_PAGE = 8
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredScans.value.length / ITEMS_PER_PAGE))

const paginatedScans = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredScans.value.slice(start, end)
})

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Reset page when data or filter changes
watch([scans, filter], () => {
  currentPage.value = 1
})

async function fetchScans() {
  loading.value = true
  error.value = null
  try {
    scans.value = await AdminService.getAllScans()
  } catch (err) {
    console.error('Failed to fetch platform scans:', err)
    error.value = 'Failed to load platform scans. Please try again later.'
  } finally {
    loading.value = false
  }
}

function openDetails(scan) {
  selectedScan.value = scan
  isDetailOpen.value = true
}

function closeDetails() {
  isDetailOpen.value = false
  selectedScan.value = null
}

function formatStatus(status) {
  const s = status?.toLowerCase()
  if (s === 'pending') return 'Running'
  return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
}

function getStatusClass(status) {
  const s = status?.toLowerCase()
  if (s === 'completed') return 'badge--success'
  if (s === 'failed') return 'badge--critical'
  if (s === 'pending') return 'badge--muted'
  return 'badge--muted'
}

onMounted(() => {
  fetchScans()
})
</script>

<template>
  <div class="platform-scans">
    <div class="view-header">
      <div class="header-left">
        <p class="view-desc">Monitor and inspect all security scans executed across the entire platform.</p>
        <div class="filter-tabs">
          <button
            v-for="opt in ['all', 'completed', 'running', 'failed']"
            :key="opt"
            type="button"
            class="tab-btn"
            :class="{ active: filter === opt }"
            @click="filter = opt"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      <button @click="fetchScans" class="btn btn-ghost btn-sm" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="error" class="error-banner card">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <div class="card table-card">
      <div v-if="loading && scans.length === 0" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading scans...</p>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Status</th>
              <th>Risk Score</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paginatedScans" :key="s.id">
              <td>
                <div class="repo-cell">
                  <span class="repo-name">{{ s.repo_url || 'N/A' }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(s.status)">
                  {{ formatStatus(s.status) }}
                </span>
              </td>
              <td class="risk-score">
                {{ s.risk_score !== null ? s.risk_score.toFixed(1) : 'N/A' }}
              </td>
              <td class="text-muted">
                {{ s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A' }}
              </td>
              <td>
                <button @click="openDetails(s)" class="btn-link">View Details</button>
              </td>
            </tr>
            <tr v-if="!loading && filteredScans.length === 0">
              <td colspan="5" class="empty-state">No scans found matching the criteria.</td>
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

    <!-- Scan Metadata Detail Sheet -->
    <Sheet v-model:open="isDetailOpen" title="Scan Details" @close="closeDetails">
      <div v-if="selectedScan" class="scan-details-content">
        <section class="detail-section">
          <h3>Information</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Repository URL</label>
              <code class="code-block">{{ selectedScan.repo_url }}</code>
            </div>
            <div class="detail-item">
              <label>Scan ID</label>
              <span class="mono">{{ selectedScan.id }}</span>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span class="badge" :class="getStatusClass(selectedScan.status)">
                  {{ formatStatus(selectedScan.status) }}
                </span>
            </div>
            <div class="detail-item">
              <label>Risk Score</label>
              <span class="risk-score-large">{{ selectedScan.risk_score?.toFixed(2) || 'N/A' }}</span>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h3>Timestamps</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Started At</label>
              <span>{{ selectedScan.created_at ? new Date(selectedScan.created_at).toLocaleString() : 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Finished At</label>
              <span>{{ selectedScan.finished_at ? new Date(selectedScan.finished_at).toLocaleString() : 'N/A' }}</span>
            </div>
          </div>
        </section>

        <section class="detail-section" v-if="selectedScan.findings?.length">
          <h3>Findings Summary ({{ selectedScan.findings.length }})</h3>
          <div class="findings-mini-list">
            <div v-for="f in selectedScan.findings.slice(0, 5)" :key="f.id" class="finding-brief">
              <span class="badge badge--sm" :class="f.severity?.toLowerCase() === 'high' ? 'badge--critical' : 'badge--warning'">
                {{ f.severity }}
              </span>
              <span class="finding-title">{{ f.title }}</span>
            </div>
            <p v-if="selectedScan.findings.length > 5" class="more-hint">...and {{ selectedScan.findings.length - 5 }} more findings</p>
          </div>
        </section>

        <section class="detail-section">
          <h3>Raw Metadata</h3>
          <pre class="raw-json">{{ JSON.stringify(selectedScan, null, 2) }}</pre>
        </section>
      </div>
    </Sheet>
  </div>
</template>

<style scoped>
.platform-scans {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-desc {
  color: var(--text-muted);
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-elevated);
  padding: 0.25rem;
  border-radius: var(--radius-lg);
  width: fit-content;
}

.tab-btn {
  padding: 0.4rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  color: var(--text);
}

.tab-btn.active {
  background: var(--bg-card);
  color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.table-card {
  padding: 0;
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-rgb), 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.risk-score {
  font-weight: 700;
  color: var(--accent);
  font-family: var(--font-mono);
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.scan-details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
}

.detail-section h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.code-block {
  font-family: var(--font-mono);
  background: var(--bg-elevated);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  word-break: break-all;
}

.mono {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.risk-score-large {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  font-family: var(--font-mono);
}

.findings-mini-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.finding-brief {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.raw-json {
  background: #1a1a1a;
  color: #a3e635;
  padding: 1rem;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  max-height: 300px;
  overflow: auto;
}

.badge--sm {
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
}

.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: var(--text-muted);
}
</style>
