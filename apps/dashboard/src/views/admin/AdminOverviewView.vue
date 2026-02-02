<script setup>
import { computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import LineChart from '../../components/charts/LineChart.vue'
import BarChart from '../../components/charts/BarChart.vue'

const { tenants } = useAuth()

const stats = computed(() => [
  { label: 'Total tenants', value: tenants.value.length },
  { label: 'Active tenants', value: tenants.value.filter((t) => t.status === 'active').length },
  { label: 'Total users', value: tenants.value.reduce((acc, t) => acc + t.usersCount, 0) },
  { label: 'Suspended', value: tenants.value.filter((t) => t.status === 'suspended').length },
])

const recentTenants = computed(() =>
  [...tenants.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
)

const growthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const growthData = {
  labels: growthLabels,
  datasets: [
    { label: 'Tenants', data: [2, 2, 3, 3, 4, 4], color: '#22d3ee', fill: true },
    { label: 'Total users', data: [12, 18, 28, 35, 52, 65], color: '#34d399', fill: true, fillColor: '#34d399' },
  ],
}

const usersByTenant = computed(() => ({
  labels: tenants.value.map((t) => t.name),
  datasets: [{ label: 'Users', data: tenants.value.map((t) => t.usersCount), backgroundColor: 'rgba(34, 211, 238, 0.6)' }],
}))
</script>

<template>
  <div class="admin-overview">
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card card">
        <span class="stat-label">{{ s.label }}</span>
        <span class="stat-value">{{ s.value }}</span>
      </div>
    </div>

    <div class="charts-row">
      <section class="card section-card chart-card">
        <h2 class="chart-title">Platform growth (tenants & users)</h2>
        <LineChart
          :labels="growthData.labels"
          :datasets="growthData.datasets"
          :height="220"
        />
      </section>
      <section class="card section-card chart-card">
        <h2 class="chart-title">Users by tenant</h2>
        <BarChart
          :labels="usersByTenant.labels"
          :datasets="usersByTenant.datasets"
          :height="220"
          :horizontal="true"
        />
      </section>
    </div>

    <section class="card section-card">
      <h2 class="section-title">Recent tenants</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Organization</th>
              <th>Slug</th>
              <th>Plan</th>
              <th>Users</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in recentTenants" :key="t.id">
              <td>{{ t.name }}</td>
              <td><code class="code">{{ t.slug }}</code></td>
              <td>{{ t.plan }}</td>
              <td>{{ t.usersCount }}</td>
              <td>
                <span class="badge" :class="t.status === 'active' ? 'badge--success' : 'badge--critical'">
                  {{ t.status }}
                </span>
              </td>
              <td class="text-muted">{{ t.createdAt }}</td>
              <td>
                <router-link :to="`/admin/tenants?highlight=${t.id}`" class="link">Manage</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <router-link to="/admin/tenants" class="link" style="display: inline-block; margin-top: 1rem;">View all tenants</router-link>
    </section>
  </div>
</template>

<style scoped>
.admin-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--accent);
}

.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  padding: 1.25rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.section-card {
  padding: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background: var(--bg-elevated);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.text-muted {
  color: var(--text-muted);
}

.link {
  font-size: 0.9rem;
}
</style>
