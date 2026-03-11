<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Sheet from '../components/Sheet.vue'
import Toast from '../components/Toast.vue'
import DashboardAuthService from '../services/authService'
import ScanService from '../services/scanService'

const filter = ref('all')
const isSheetOpen = ref(false)
const isSubmitting = ref(false)
const submitError = ref(null)
const formData = ref({
  repo_url: '',
  git_token: ''
})

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

// Scans data
const scans = ref([])
const isLoadingScans = ref(false)
const isPolling = ref(false)
const scansError = ref(null)
const previousStatuses = ref(new Map()) // Track scan statuses for notifications

// Findings sheet
const isFindingsSheetOpen = ref(false)
const selectedScan = ref(null)
const resolvingFindings = ref(new Set()) // Track which findings are being resolved

// Pagination
const ITEMS_PER_PAGE = 8
const currentPage = ref(1)

const filteredScans = computed(() => {
  if (filter.value === 'completed') return scans.value.filter((s) => s.status === 'completed')
  if (filter.value === 'failed') return scans.value.filter((s) => s.status === 'failed')
  if (filter.value === 'running') return scans.value.filter((s) => s.status === 'pending')
  return scans.value
})

const totalPages = computed(() => Math.ceil(filteredScans.value.length / ITEMS_PER_PAGE))

const paginatedScans = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredScans.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(filter, () => {
  currentPage.value = 1
})

// Fetch scans from API
const fetchScans = async (isBackground = false) => {
  if (!isBackground) {
    isLoadingScans.value = true
  } else {
    isPolling.value = true
  }
  scansError.value = null

  try {
    const data = await ScanService.getScans()
    
    // Check for status changes to show notifications
    if (isBackground) {
      data.forEach(scan => {
        const prevStatus = previousStatuses.value.get(scan.id)
        if (prevStatus && prevStatus !== scan.status) {
          if (scan.status === 'completed') {
            showToast(`Scan for ${scan.repo_url} has completed!`, 'success')
          } else if (scan.status === 'failed') {
            showToast(`Scan for ${scan.repo_url} has failed.`, 'error')
          }
        }
        // Update stored status
        previousStatuses.value.set(scan.id, scan.status)
      })
    } else {
      // First load, just initialize the map
      data.forEach(scan => {
        previousStatuses.value.set(scan.id, scan.status)
      })
    }

    scans.value = data
  } catch (error) {
    console.error('Error fetching scans:', error)
    if (!isBackground) {
      scansError.value = error.message
    }
  } finally {
    isLoadingScans.value = false
    isPolling.value = false
  }
}

// Polling interval
let pollInterval = null

const startPolling = () => {
  if (pollInterval) return
  pollInterval = setInterval(() => {
    fetchScans(true)
  }, 5000)
}

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

// Load scans on mount
onMounted(() => {
  fetchScans()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

const openSheet = () => {
  isSheetOpen.value = true
  submitError.value = null
}

const closeSheet = () => {
  isSheetOpen.value = false
  submitError.value = null
  formData.value = {
    repo_url: '',
    git_token: ''
  }
}

const openFindingsSheet = (scan) => {
  selectedScan.value = scan
  isFindingsSheetOpen.value = true
}

const closeFindingsSheet = () => {
  isFindingsSheetOpen.value = false
  selectedScan.value = null
}

const getSeverityClass = (severity) => {
  const severityMap = {
    'CRITICAL': 'badge--critical',
    'HIGH': 'badge--high',
    'MEDIUM': 'badge--warning',
    'LOW': 'badge--muted',
  }
  return severityMap[severity] || 'badge--muted'
}

const formatRiskScore = (score) => {
  if (score === null || score === undefined) return 'N/A'
  return score.toFixed(1)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = null

  try {
    // Prepare request body - only include git_token if provided
    const requestBody = {
      repo_url: formData.value.repo_url
    }
    
    if (formData.value.git_token && formData.value.git_token.trim() !== '') {
      requestBody.git_token = formData.value.git_token
    }

    const response = await DashboardAuthService.request('/scans', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to submit scan' }))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Scan submitted successfully:', result)
    
    // Close the sheet on success
    closeSheet()
    
    // Refresh scans list
    fetchScans()
    
    // Show success toast notification
    showToast('Security scan started successfully!', 'success')
  } catch (error) {
    console.error('Error submitting scan:', error)
    
    // Provide more helpful error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      submitError.value = 'Unable to connect to the API server. Please ensure the backend is reachable at https://code-security-platform.onrender.com'
    } else if (error.message.includes('CORS')) {
      submitError.value = 'CORS error: The API server needs to allow requests from this origin'
    } else {
      submitError.value = error.message
    }
  } finally {
    isSubmitting.value = false
  }
}

// Resolve a finding
const resolveFinding = async (finding) => {
  if (!finding.id) {
    console.error('Finding ID missing')
    showToast('Unable to resolve finding: ID missing', 'error')
    return
  }

  resolvingFindings.value.add(finding.id)

  try {
    const response = await DashboardAuthService.request(`/findings/${finding.id}/resolve`, {
      method: 'POST'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to resolve finding' }))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    // Mark finding as resolved in the UI
    if (selectedScan.value && selectedScan.value.findings) {
      const findingIndex = selectedScan.value.findings.findIndex(f => f.id === finding.id)
      if (findingIndex !== -1) {
        selectedScan.value.findings[findingIndex].status = 'resolved'
      }
    }

    showToast('Finding resolved successfully!', 'success')
  } catch (error) {
    console.error('Error resolving finding:', error)
    showToast(`Failed to resolve finding: ${error.message}`, 'error')
  } finally {
    resolvingFindings.value.delete(finding.id)
  }
}
</script>

<template>
  <div class="scans-view">
    <Toast
      v-model:show="toast.show"
      :variant="toast.variant"
      :message="toast.message"
    />
    
    <div class="view-header">
      <div class="filter-tabs">
        <button
          v-for="opt in ['all', 'completed', 'running', 'failed']"
          :key="opt"
          type="button"
          class="tab"
          :class="{ active: filter === opt }"
          @click="filter = opt"
        >
          {{ opt }}
        </button>
      </div>
      <button type="button" class="btn btn-primary" @click="openSheet">Run scan</button>
    </div>

    <Sheet v-model:open="isSheetOpen" title="Run Security Scan" @close="closeSheet">
      <form @submit.prevent="handleSubmit" class="scan-form">
        <div v-if="submitError" class="error-alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5V8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
          </svg>
          <span>{{ submitError }}</span>
        </div>

        <div class="form-group">
          <label for="repo_url" class="form-label">Repository URL</label>
          <input
            id="repo_url"
            v-model="formData.repo_url"
            type="text"
            class="form-input"
            placeholder="https://github.com/username/repo"
            :disabled="isSubmitting"
            required
          />
          <p class="form-hint">Enter the Git repository URL to scan</p>
        </div>

        <div class="form-group">
          <label for="git_token" class="form-label">
            Git Token 
            <span class="optional-badge">Optional</span>
          </label>
          <input
            id="git_token"
            v-model="formData.git_token"
            type="password"
            class="form-input"
            placeholder="ghp_xxxxxxxxxxxx"
            :disabled="isSubmitting"
          />
          <p class="form-hint">Personal access token for private repositories (leave empty for public repos)</p>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="closeSheet" :disabled="isSubmitting">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="btn-spinner"></span>
            {{ isSubmitting ? 'Submitting...' : 'Run Scan' }}
          </button>
        </div>
      </form>
    </Sheet>

    <div class="card table-card">
      <div v-if="isLoadingScans" class="loading-state">
        <div class="spinner"></div>
        <p>Loading scans...</p>
      </div>

      <div v-else-if="scansError" class="error-state">
        <p>{{ scansError }}</p>
        <button type="button" class="btn btn-ghost" @click="fetchScans">Retry</button>
      </div>

      <div v-else-if="filteredScans.length === 0" class="empty-state">
        <p>No scans found</p>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Repository URL</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paginatedScans" :key="s.id">
              <td class="repo-url">{{ s.repo_url }}</td>
              <td>
                <span class="risk-score">{{ formatRiskScore(s.risk_score) }}</span>
              </td>
              <td>
                <span class="badge" :class="s.status === 'completed' ? 'badge--success' : s.status === 'failed' ? 'badge--critical' : 'badge--muted'">
                  {{ s.status === 'pending' ? 'running' : s.status }}
                </span>
              </td>
              <td>
                <button
                  type="button"
                  class="link"
                  @click="openFindingsSheet(s)"
                  :disabled="!s.findings || s.findings.length === 0"
                >
                  View
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

    <!-- Findings Sheet -->
    <Sheet v-model:open="isFindingsSheetOpen" title="Scan Findings" @close="closeFindingsSheet">
      <div v-if="selectedScan" class="findings-content">
        <div class="findings-header">
          <div class="info-row">
            <span class="info-label">Repository:</span>
            <code class="code">{{ selectedScan.repo_url }}</code>
          </div>
          <div class="info-row">
            <span class="info-label">Risk Score:</span>
            <span class="risk-score-large">{{ formatRiskScore(selectedScan.risk_score) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="badge" :class="selectedScan.status === 'completed' ? 'badge--success' : 'badge--critical'">
              {{ selectedScan.status === 'pending' ? 'running' : selectedScan.status }}
            </span>
          </div>
        </div>

        <div v-if="selectedScan.findings && selectedScan.findings.length > 0" class="findings-list">
          <h3 class="findings-title">Findings ({{ selectedScan.findings.length }})</h3>
          
          <div v-for="finding in selectedScan.findings" :key="finding.id" class="finding-card">
            <div class="finding-header">
              <div class="finding-title-row">
                <h4 class="finding-title">{{ finding.title }}</h4>
                <span class="badge" :class="getSeverityClass(finding.severity)">
                  {{ finding.severity }}
                </span>
              </div>
              <div class="finding-meta">
                <span class="meta-item">
                  <strong>Scanner:</strong> {{ finding.scanner_name }}
                </span>
                <span class="meta-item" v-if="finding.file_path">
                  <strong>File:</strong> <code class="code-inline">{{ finding.file_path }}</code>
                </span>
                <span class="meta-item" v-if="finding.line_number">
                  <strong>Line:</strong> {{ finding.line_number }}
                </span>
              </div>
            </div>
            
            <div v-if="finding.description" class="finding-description">
              {{ finding.description }}
            </div>
            
            <div v-if="finding.remediation" class="finding-remediation">
              <strong>Remediation:</strong> {{ finding.remediation }}
            </div>
            
            <div v-if="finding.cve_id" class="finding-cve">
              <strong>CVE ID:</strong> <code class="code-inline">{{ finding.cve_id }}</code>
            </div>
            
            <div class="finding-actions">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="resolveFinding(finding)"
                :disabled="resolvingFindings.has(finding.id)"
              >
                <span v-if="resolvingFindings.has(finding.id)" class="spinner-small"></span>
                {{ resolvingFindings.has(finding.id) ? 'Resolving...' : 'Resolve' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="no-findings">
          <p>No findings for this scan</p>
        </div>
      </div>
    </Sheet>
  </div>
</template>

<style scoped>
.scans-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab:hover {
  color: var(--text);
  border-color: var(--text-secondary);
  background: var(--bg-hover);
}

.tab.active {
  background: var(--accent-light);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
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

.link {
  font-size: 0.85rem;
}

.scan-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--critical-light);
  border: 1px solid var(--critical);
  border-radius: var(--radius-md);
  color: var(--critical);
  font-size: 0.9rem;
  font-weight: 500;
}

.error-alert svg {
  flex-shrink: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.optional-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.form-input {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  font-size: 0.9rem;
  font-family: var(--font-sans);
  transition: all var(--transition-fast);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
  background: var(--bg-card);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.repo-url {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
}

.risk-score {
  font-weight: 700;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 1rem;
}

.link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0;
  transition: color var(--transition-fast);
}

.link:hover:not(:disabled) {
  color: var(--accent-hover);
}

.link:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Findings Sheet Styles */
.findings-content {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.findings-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
}

.info-label {
  font-weight: 700;
  color: var(--text-muted);
  min-width: 120px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 0.8rem;
}

.risk-score-large {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  font-family: var(--font-mono);
}

.findings-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  margin-bottom: 0.5rem;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.finding-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all var(--transition-base);
}

.finding-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}

.finding-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.finding-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.finding-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.finding-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.finding-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.finding-remediation {
  font-size: 0.95rem;
  color: var(--text-secondary);
  padding: 1rem;
  background: var(--accent-light);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
  line-height: 1.6;
}

.finding-cve {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.code-inline {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--bg-elevated);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
  color: var(--accent);
}

.no-findings {
  text-align: center;
  padding: 2.5rem;
  color: var(--text-secondary);
}

.finding-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  height: auto;
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
