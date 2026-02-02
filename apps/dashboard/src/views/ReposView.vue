<script setup>
const repos = [
  { name: 'acme-api', provider: 'GitHub', branch: 'main', lastScan: '2 hrs ago', status: 'passed', issues: 0 },
  { name: 'acme-web', provider: 'GitHub', branch: 'main', lastScan: '15 min ago', status: 'failed', issues: 2 },
  { name: 'acme-mobile', provider: 'GitHub', branch: 'main', lastScan: '2 hrs ago', status: 'passed', issues: 0 },
  { name: 'acme-infra', provider: 'GitHub', branch: 'main', lastScan: '1 day ago', status: 'passed', issues: 0 },
  { name: 'acme-docs', provider: 'GitHub', branch: 'main', lastScan: '3 days ago', status: 'passed', issues: 0 },
]
</script>

<template>
  <div class="repos-view">
    <div class="view-header">
      <p class="view-desc">Connected repositories and their last scan status.</p>
      <button type="button" class="btn btn-primary">Connect repository</button>
    </div>

    <div class="card table-card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Provider</th>
              <th>Default branch</th>
              <th>Last scan</th>
              <th>Status</th>
              <th>Open issues</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in repos" :key="r.name">
              <td>
                <span class="repo-name">{{ r.name }}</span>
              </td>
              <td>{{ r.provider }}</td>
              <td><code class="code">{{ r.branch }}</code></td>
              <td class="text-muted">{{ r.lastScan }}</td>
              <td>
                <span class="badge" :class="r.status === 'passed' ? 'badge--success' : 'badge--critical'">
                  {{ r.status }}
                </span>
              </td>
              <td>{{ r.issues }}</td>
              <td>
                <router-link :to="`/scans?repo=${r.name}`" class="link">Scans</router-link>
                <span class="sep">·</span>
                <button type="button" class="btn-link">Settings</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.repos-view {
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

.view-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-card .table-wrap {
  border: none;
  border-radius: 0;
}

.repo-name {
  font-weight: 500;
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

.sep {
  color: var(--border);
  margin: 0 0.35rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.link {
  font-size: 0.85rem;
}
</style>
