<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import BillingService from '../services/billingService'

const { currentUser } = useAuth()

// ── State ──────────────────────────────────────────────────────────────────
const usageData    = ref(null)
const invoices     = ref([])
const isLoading    = ref(true)
const error        = ref(null)
const showUpgradeModal = ref(false)
const selectedPlan = ref(null)
const upgrading    = ref(false)
const upgradeSuccess = ref(false)

// ── Plan definitions ───────────────────────────────────────────────────────
const plans = [
  {
    name: 'Starter',
    price: 0,
    scanQuota: 50,
    features: ['50 scans / month', '1 repository', 'Standard support', 'Email alerts'],
    recommended: false,
    color: 'var(--text-muted)'
  },
  {
    name: 'Team',
    price: 15,
    scanQuota: 500,
    features: ['500 scans / month', 'Up to 10 repos', 'Priority support', 'Jira & Slack integration', 'Advanced analytics'],
    recommended: true,
    color: 'var(--accent)'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    scanQuota: -1,
    features: ['Unlimited scans', 'Unlimited repos', '24/7 dedicated support', 'Custom integrations', 'SLA guarantees', 'SSO'],
    recommended: false,
    color: '#a78bfa'
  }
]

// ── Derived plan info from API ─────────────────────────────────────────────
const currentPlan = computed(() => {
  const raw = usageData.value
  if (!raw) return { name: '—', price: 0 }
  const planName = raw.plan || raw.subscription_plan || 'Starter'
  return plans.find(p => p.name.toLowerCase() === planName.toLowerCase()) || {
    name: planName, price: 0, features: [], recommended: false
  }
})

// ── Usage metrics mapped from API ──────────────────────────────────────────
const usageMetrics = computed(() => {
  const raw = usageData.value
  if (!raw) return []

  const metrics = []

  // Scans
  const scansUsed  = raw.current_month_usage ?? raw.scans_used  ?? 0
  const scansLimit = raw.scan_quota_limit     ?? raw.scan_limit  ?? 1000
  metrics.push({
    label: 'Scans Used',
    value: scansUsed,
    limit: scansLimit === -1 ? 'Unlimited' : scansLimit,
    color: 'var(--accent)',
    icon: '🔍'
  })

  // Resolutions
  const resUsed  = raw.resolutions_used ?? 0
  const resLimit = raw.resolve_quota_limit ?? raw.resolution_limit ?? 100
  metrics.push({
    label: 'Resolutions',
    value: resUsed,
    limit: resLimit === -1 ? 'Unlimited' : resLimit,
    color: '#a78bfa',
    icon: '✅'
  })

  // Repositories
  if (raw.repos_count !== undefined || raw.repository_count !== undefined) {
    const repoCount = raw.repos_count ?? raw.repository_count ?? 0
    const repoLimit = raw.repo_limit ?? raw.repository_limit ?? 10
    metrics.push({
      label: 'Repositories',
      value: repoCount,
      limit: repoLimit === -1 ? 'Unlimited' : repoLimit,
      color: '#34d399',
      icon: '📁'
    })
  }

  return metrics
})

const planMeta = computed(() => {
  const raw = usageData.value || {}
  const quota = raw.scan_quota_limit ?? raw.scan_limit ?? 1000
  const used = raw.current_month_usage ?? raw.scans_used ?? 0
  
  return {
    plan: raw.plan || raw.subscription_plan || 'Starter',
    quota: quota === -1 ? 'Unlimited' : quota,
    used: used,
    remaining: quota === -1 ? null : Math.max(0, quota - used),
    resetDate: raw.reset_date ?? 'Next Month',
    userId: raw.user_id ?? currentUser.value?.id ?? null,
  }
})

// ── Data loading ───────────────────────────────────────────────────────────
async function loadBillingData() {
  isLoading.value = true
  error.value     = null

  try {
    const data = await BillingService.getUserUsage()
    // The API returns the summary object directly, possibly with a 'usage' array history
    usageData.value = data

    // Also try to load invoices (graceful fail)
    try {
      // Use 'me' if no tenant_id is explicitly provided in the usage response
      const invData   = await BillingService.getInvoices(data.tenant_id ?? 'me')
      invoices.value  = Array.isArray(invData) ? invData : (invData.invoices ?? [])
    } catch (_) {
      invoices.value = []
    }
  } catch (err) {
    console.error('BillingView load error:', err)
    error.value = err.message || 'Failed to load usage data.'
  } finally {
    isLoading.value = false
  }
}

// ── Progress helper ────────────────────────────────────────────────────────
function getProgress(metric) {
  if (metric.limit === 'Unlimited') return 5
  const v = typeof metric.value === 'string' ? parseFloat(metric.value.replace(/,/g, '')) : metric.value
  const l = typeof metric.limit === 'string' ? parseFloat(metric.limit.replace(/,/g, '')) : metric.limit
  if (!l || l === 0) return 0
  return Math.min(100, (v / l) * 100)
}

function getProgressClass(metric) {
  const p = getProgress(metric)
  if (p >= 90) return 'danger'
  if (p >= 70) return 'warning'
  return 'ok'
}

function formatNumber(n) {
  return typeof n === 'number' ? n.toLocaleString() : n
}

// ── Upgrade modal ──────────────────────────────────────────────────────────
function openUpgradeModal(plan) {
  selectedPlan.value   = plan
  showUpgradeModal.value = true
  upgradeSuccess.value = false
}

function closeModal() {
  showUpgradeModal.value = false
  selectedPlan.value     = null
  upgradeSuccess.value   = false
}

async function confirmUpgrade() {
  if (!selectedPlan.value) return
  upgrading.value = true
  try {
    // Placeholder: send upgrade request when endpoint is available
    await new Promise(r => setTimeout(r, 1200))
    upgradeSuccess.value = true
  } finally {
    upgrading.value = false
  }
}

onMounted(loadBillingData)
</script>

<template>
  <div class="billing-view">
    <!-- Header -->
    <header class="view-header">
      <div class="header-content">
        <h1 class="view-title">Subscription &amp; Billing</h1>
        <p class="view-subtitle">Track your usage, manage your plan, and upgrade for more capacity.</p>
      </div>
      <div class="header-actions" v-if="!isLoading && !error">
        <button
          v-if="currentPlan.name !== 'Enterprise'"
          class="btn btn-primary upgrade-cta"
          @click="openUpgradeModal(null)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          Upgrade Plan
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Fetching usage data…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state card">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="btn btn-secondary" @click="loadBillingData">Retry</button>
    </div>

    <template v-else>
      <!-- Top Grid: Plan Card + Quota Summary -->
      <div class="billing-grid">
        <!-- Plan Hero -->
        <section class="card plan-hero">
          <div class="plan-glow"></div>
          <div class="plan-header">
            <span class="badge badge--success">Active</span>
            <h2 class="hero-plan-name">{{ planMeta.plan }} Plan</h2>
          </div>
          <div class="plan-main">
            <div class="quota-ring-wrap">
              <svg class="quota-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke-width="8" class="ring-bg"/>
                <circle
                  cx="50" cy="50" r="42" stroke-width="8"
                  class="ring-fill"
                  :stroke-dasharray="`${(planMeta.used / (planMeta.quota === 'N/A' ? 1 : planMeta.quota)) * 263.9} 263.9`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="ring-label">
                <span class="ring-value">{{ formatNumber(planMeta.used) }}</span>
                <span class="ring-sub">of {{ formatNumber(planMeta.quota) }} scans</span>
              </div>
            </div>
            <div class="plan-info-row" v-if="planMeta.remaining !== null">
              <span class="info-chip">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ formatNumber(planMeta.remaining) }} scans remaining
              </span>
              <span class="info-chip" v-if="planMeta.resetDate">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Resets {{ planMeta.resetDate }}
              </span>
            </div>
          </div>
          <div class="plan-footer">
            <button class="btn btn-ghost btn-sm">Manage Subscription</button>
            <button
              v-if="currentPlan.name !== 'Enterprise'"
              class="btn btn-primary btn-sm"
              @click="openUpgradeModal(null)"
            >Upgrade Plan</button>
          </div>
        </section>

        <!-- Usage Metrics -->
        <section class="card usage-card">
          <h2 class="card-title">Resource Usage</h2>
          <div v-if="usageMetrics.length" class="usage-bars">
            <div v-for="u in usageMetrics" :key="u.label" class="usage-item">
              <div class="usage-info">
                <span class="usage-name">
                  <span class="usage-icon">{{ u.icon }}</span>
                  {{ u.label }}
                </span>
                <span class="usage-stats">
                  <strong>{{ formatNumber(u.value) }}</strong>
                  <span class="stat-sep"> / </span>
                  {{ u.limit === 'Unlimited' ? '∞' : formatNumber(u.limit) }}
                </span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :class="`progress-fill--${getProgressClass(u)}`"
                  :style="{ width: getProgress(u) + '%', backgroundColor: u.color }"
                ></div>
              </div>
              <p v-if="getProgressClass(u) === 'danger'" class="usage-warn">
                ⚠ You&apos;re close to your limit. Consider <a href="#" @click.prevent="openUpgradeModal(null)">upgrading</a>.
              </p>
            </div>
          </div>
          <div v-else class="empty-usage">
            <p class="text-muted">No usage data available yet for this period.</p>
          </div>
          <div class="usage-footer">
            <p class="text-xs text-muted">Usage resets on the 1st of every month.</p>
            <button class="btn btn-ghost btn-xs" @click="loadBillingData">↻ Refresh</button>
          </div>
        </section>
      </div>

      <!-- Plan Comparison -->
      <section class="plan-comparison">
        <h2 class="section-title">Available Plans</h2>
        <div class="plans-grid">
          <div
            v-for="p in plans"
            :key="p.name"
            class="card plan-item"
            :class="{
              'plan-item--active': p.name === currentPlan.name,
              'plan-item--recommended': p.recommended
            }"
          >
            <div v-if="p.recommended" class="recommended-ribbon">Most Popular</div>
            <h3 class="plan-item-name">{{ p.name }}</h3>
            <div class="plan-item-price">
              <span v-if="p.price !== 'Custom'" class="p-currency">$</span>
              <span class="p-amount" :style="p.price === 'Custom' ? 'font-size: 1.8rem;' : ''">{{ p.price }}</span>
              <span v-if="p.price !== 'Custom'" class="p-period">/mo</span>
            </div>
            <ul class="plan-features">
              <li v-for="f in p.features" :key="f">
                <span class="check-icon">✓</span> {{ f }}
              </li>
            </ul>
            <button
              class="btn btn-block"
              :class="p.name === currentPlan.name ? 'btn-ghost' : (p.recommended ? 'btn-primary' : 'btn-secondary')"
              :disabled="p.name === currentPlan.name"
              @click="p.name !== currentPlan.name && openUpgradeModal(p)"
            >
              {{ p.name === currentPlan.name ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Invoices -->
      <section class="card invoices-card" v-if="invoices.length">
        <h2 class="card-title">Billing History</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Amount</th><th>Status</th><th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invoices" :key="inv.id">
                <td>{{ inv.date }}</td>
                <td><span class="font-mono">{{ inv.amount }}</span></td>
                <td>
                  <span class="badge" :class="inv.status === 'Paid' ? 'badge--success' : 'badge--warning'">
                    {{ inv.status }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="btn-icon" title="Download Invoice">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <!-- ── Upgrade Modal ─────────────────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showUpgradeModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">
          <button class="modal-close" @click="closeModal">✕</button>

          <!-- Success state -->
          <div v-if="upgradeSuccess" class="modal-success">
            <div class="success-icon">🎉</div>
            <h3>You're all set!</h3>
            <p>Your plan is being upgraded to <strong>{{ selectedPlan?.name }}</strong>. Changes take effect immediately.</p>
            <button class="btn btn-primary" @click="closeModal">Done</button>
          </div>

          <!-- Plan selection state -->
          <template v-else>
            <h2 class="modal-title">
              {{ selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Choose a Plan' }}
            </h2>
            <p class="modal-subtitle">
              You are currently on the <strong>{{ currentPlan.name }}</strong> plan.
            </p>

            <div class="modal-plans">
              <div
                v-for="p in plans.filter(x => x.name !== currentPlan.name)"
                :key="p.name"
                class="modal-plan-card"
                :class="{ 'modal-plan-card--selected': selectedPlan?.name === p.name, 'modal-plan-card--recommended': p.recommended }"
                @click="selectedPlan = p"
              >
                <div class="mpc-header">
                  <span class="mpc-name">{{ p.name }}</span>
                  <span v-if="p.recommended" class="mpc-badge">Popular</span>
                </div>
                <div class="mpc-price">
                  <span v-if="p.price !== 'Custom'" class="mpc-dollar">$</span>
                  <span class="mpc-amount" :class="{ 'text-2xl': p.price === 'Custom' }">{{ p.price }}</span>
                  <span v-if="p.price !== 'Custom'" class="mpc-period">/mo</span>
                </div>
                <ul class="mpc-features">
                  <li v-for="f in p.features" :key="f">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </li>
                </ul>
                <div class="mpc-radio" :class="{ active: selectedPlan?.name === p.name }"></div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-ghost" @click="closeModal">Cancel</button>
              <button
                class="btn btn-primary"
                :disabled="!selectedPlan || upgrading"
                @click="confirmUpgrade"
              >
                <span v-if="upgrading" class="spinner-sm"></span>
                <span v-else>Confirm Upgrade →</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Layout ───────────────────────────────────────────────────────────────── */
.billing-view {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 3rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.view-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.view-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.billing-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1100px) {
  .billing-grid { grid-template-columns: 1fr; }
}

/* ── Upgrade CTA ──────────────────────────────────────────────────────────── */
.upgrade-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
}

/* ── Plan Hero ────────────────────────────────────────────────────────────── */
.plan-hero {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
}

.plan-glow {
  position: absolute;
  top: -60px; right: -60px;
  width: 220px; height: 220px;
  background: var(--accent-glow, rgba(6,182,212,0.15));
  filter: blur(80px);
  border-radius: 50%;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.hero-plan-name {
  font-size: 1.6rem;
  font-weight: 800;
}

.plan-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1;
  margin: 1rem 0;
}

/* Donut ring ────────────────────────────── */
.quota-ring-wrap {
  position: relative;
  width: 140px;
  height: 140px;
}

.quota-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--border-light, rgba(255,255,255,0.08));
}

.ring-fill {
  fill: none;
  stroke: var(--accent);
  stroke-dasharray: 0 263.9;
  transition: stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 6px rgba(6,182,212,0.5));
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
}

.ring-sub {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  max-width: 80px;
}

.plan-info-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: var(--text-muted);
  background: var(--bg-hover, rgba(255,255,255,0.05));
  border: 1px solid var(--border-light, rgba(255,255,255,0.07));
  border-radius: 20px;
  padding: 0.2rem 0.65rem;
}

.plan-footer {
  display: flex;
  gap: 1rem;
  z-index: 1;
}

/* ── Usage Card ───────────────────────────────────────────────────────────── */
.usage-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.usage-bars {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-top: 0.5rem;
  flex: 1;
}

.usage-item {}

.usage-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.45rem;
}

.usage-name {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.usage-icon { font-size: 0.9rem; }

.usage-stats {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-family: var(--font-mono, monospace);
}

.stat-sep { opacity: 0.4; }

.progress-track {
  height: 7px;
  background: var(--bg-hover, rgba(255,255,255,0.06));
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 4px;
}

.progress-fill--danger {
  animation: pulse-danger 2s ease-in-out infinite;
}

@keyframes pulse-danger {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.7; }
}

.usage-warn {
  font-size: 0.78rem;
  color: #f87171;
  margin-top: 0.4rem;
}

.usage-warn a {
  color: var(--accent);
  text-decoration: underline;
  cursor: pointer;
}

.empty-usage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.usage-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light, rgba(255,255,255,0.07));
}

.btn-xs {
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
}

/* ── Plan Comparison ──────────────────────────────────────────────────────── */
.plan-comparison {
  margin-top: 0.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.plan-item {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plan-item:hover {
  transform: translateY(-3px);
}

.plan-item--recommended {
  border-color: var(--accent);
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.12);
  transform: scale(1.02);
}

.plan-item--active {
  opacity: 0.65;
}

.recommended-ribbon {
  position: absolute;
  top: 12px; right: 12px;
  background: var(--accent);
  color: var(--bg);
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-item-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.plan-item-price {
  margin-bottom: 1.75rem;
}

.p-currency { font-size: 1.2rem; vertical-align: super; opacity: 0.7; }
.p-amount   { font-size: 2.5rem; font-weight: 800; color: var(--text); line-height: 1; }
.p-period   { font-size: 0.85rem; color: var(--text-muted); }

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  text-align: left;
  flex: 1;
}

.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.check-icon { color: var(--success, #34d399); font-weight: 800; }

/* ── Invoices ─────────────────────────────────────────────────────────────── */
.invoices-card {
  padding: 2rem;
}

.table-wrap { overflow-x: auto; margin-top: 0.75rem; }

table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.75rem 1rem; text-align: left; font-size: 0.88rem; }
th { color: var(--text-muted); font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border-light, rgba(255,255,255,0.07)); }
td { border-bottom: 1px solid var(--border-light, rgba(255,255,255,0.04)); }
tr:last-child td { border-bottom: none; }

.btn-icon {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}
.btn-icon:hover { background: var(--bg-hover); color: var(--accent); }

/* ── States ───────────────────────────────────────────────────────────────── */
.loading-overlay {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.spinner {
  width: 40px; height: 40px;
  border: 4px solid var(--border-light, rgba(255,255,255,0.1));
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-sm {
  display: inline-block;
  width: 16px; height: 16px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon { font-size: 2.5rem; }

/* ── Upgrade Modal ────────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: backdropIn 0.2s ease-out;
}

@keyframes backdropIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-box {
  background: var(--bg-card, #1a1f2e);
  border: 1px solid var(--border-light, rgba(255,255,255,0.1));
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 720px;
  position: relative;
  animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close {
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  background: none;
  border: 1px solid var(--border-light, rgba(255,255,255,0.1));
  color: var(--text-muted);
  width: 32px; height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.modal-close:hover { background: var(--bg-hover); color: var(--text); }

.modal-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.modal-subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.modal-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.modal-plan-card {
  border: 1.5px solid var(--border-light, rgba(255,255,255,0.09));
  border-radius: 14px;
  padding: 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  position: relative;
  background: var(--bg-hover, rgba(255,255,255,0.02));
}

.modal-plan-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.modal-plan-card--selected {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 2px rgba(6,182,212,0.25), 0 0 30px rgba(6,182,212,0.1);
}

.modal-plan-card--recommended {
  border-color: rgba(6,182,212,0.4);
}

.mpc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.mpc-name {
  font-weight: 700;
  font-size: 1rem;
}

.mpc-badge {
  background: var(--accent);
  color: var(--bg);
  border-radius: 12px;
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.mpc-price {
  margin-bottom: 1rem;
}

.mpc-dollar { font-size: 0.9rem; vertical-align: super; opacity: 0.7; }
.mpc-amount { font-size: 2rem; font-weight: 800; }
.mpc-period { font-size: 0.8rem; color: var(--text-muted); }

.mpc-features {
  list-style: none;
  padding: 0; margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.mpc-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.mpc-features li svg { flex-shrink: 0; color: var(--accent); margin-top: 2px; }

.mpc-radio {
  width: 18px; height: 18px;
  border: 2px solid var(--border-light, rgba(255,255,255,0.2));
  border-radius: 50%;
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  transition: all 0.2s;
}

.mpc-radio.active {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(6,182,212,0.2);
}

.mpc-radio.active::after {
  content: '';
  display: block;
  width: 6px; height: 6px;
  background: var(--bg);
  border-radius: 50%;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-light, rgba(255,255,255,0.07));
}

/* ── Success state ────────────────────────────────────────────────────────── */
.modal-success {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  font-size: 3.5rem;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounceIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.modal-success h3 {
  font-size: 1.5rem;
  font-weight: 800;
}

.modal-success p {
  color: var(--text-muted);
  max-width: 360px;
}

/* ── Shared utils ─────────────────────────────────────────────────────────── */
.btn-sm    { padding: 0.5rem 1rem; font-size: 0.8rem; }
.btn-block { width: 100%; }
.text-xs   { font-size: 0.75rem; }
.text-muted { color: var(--text-muted); }
.font-mono  { font-family: var(--font-mono, monospace); }
</style>
