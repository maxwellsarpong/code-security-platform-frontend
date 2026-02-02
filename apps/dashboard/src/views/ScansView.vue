<script setup>
import { ref } from 'vue'

const filter = ref('all')

const scans = [
  { id: 's-1024', repo: 'acme-web', branch: 'feat/auth', status: 'failed', issues: 2, duration: '1m 24s', finished: '15 min ago' },
  { id: 's-1023', repo: 'acme-api', branch: 'main', status: 'passed', issues: 0, duration: '2m 01s', finished: '2 hrs ago' },
  { id: 's-1022', repo: 'acme-mobile', branch: 'main', status: 'passed', issues: 0, duration: '0m 58s', finished: '2 hrs ago' },
  { id: 's-1021', repo: 'acme-api', branch: 'develop', status: 'passed', issues: 0, duration: '1m 45s', finished: '3 hrs ago' },
  { id: 's-1020', repo: 'acme-web', branch: 'main', status: 'passed', issues: 0, duration: '1m 12s', finished: '5 hrs ago' },
  { id: 's-1019', repo: 'acme-infra', branch: 'main', status: 'passed', issues: 0, duration: '3m 02s', finished: '1 day ago' },
]

const filteredScans = () => {
  if (filter.value === 'failed') return scans.filter((s) => s.status === 'failed')
  if (filter.value === 'passed') return scans.filter((s) => s.status === 'passed')
  return scans
}
</script>

<template>
  <div class="scans-view">
    <div class="view-header">
      <div class="filter-tabs">
        <button
          v-for="opt in ['all', 'passed', 'failed']"
          :key="opt"
          type="button"
          class="tab"
          :class="{ active: filter === opt }"
          @click="filter = opt"
        >
          {{ opt }}
        </button>
      </div>
      <button type="button" class="btn btn-primary">Run scan</button>
    </div>

    <div class="card table-card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Scan ID</th>
              <th>Repository</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Issues</th>
              <th>Duration</th>
              <th>Finished</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filteredScans()" :key="s.id">
              <td><code class="code">{{ s.id }}</code></td>
              <td>{{ s.repo }}</td>
              <td><code class="code">{{ s.branch }}</code></td>
              <td>
                <span class="badge" :class="s.status === 'passed' ? 'badge--success' : 'badge--critical'">
                  {{ s.status }}
                </span>
              </td>
              <td>{{ s.issues }}</td>
              <td>{{ s.duration }}</td>
              <td class="text-muted">{{ s.finished }}</td>
              <td>
                <router-link :to="`/scans/${s.id}`" class="link">View</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scans-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tabs {
  display: flex;
  gap: 0.25rem;
}

.tab {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.tab:hover {
  color: var(--text);
}

.tab.active {
  background: rgba(34, 211, 238, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-card .table-wrap {
  border: none;
  border-radius: 0;
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
  font-size: 0.85rem;
}
</style>
