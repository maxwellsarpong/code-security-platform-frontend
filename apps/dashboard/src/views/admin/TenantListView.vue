<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { tenants, updateTenantStatus, addTenant, setCurrentTenant } = useAuth()

const showCreate = ref(false)
const newTenant = ref({ name: '', slug: '', plan: 'Starter', status: 'active' })

function toggleStatus(tenant) {
  const next = tenant.status === 'active' ? 'suspended' : 'active'
  updateTenantStatus(tenant.id, next)
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function createTenant() {
  if (!newTenant.value.name.trim()) return
  const slug = newTenant.value.slug.trim() || slugify(newTenant.value.name)
  addTenant({
    name: newTenant.value.name.trim(),
    slug,
    plan: newTenant.value.plan,
    status: newTenant.value.status,
    usersCount: 0,
  })
  newTenant.value = { name: '', slug: '', plan: 'Starter', status: 'active' }
  showCreate.value = false
}

function viewAsTenant(tenant) {
  setCurrentTenant(tenant)
  router.push('/')
}
</script>

<template>
  <div class="tenant-list">
    <div class="view-header">
      <p class="view-desc">Manage all organizations (tenants). View as tenant or change status.</p>
      <button type="button" class="btn btn-primary" @click="showCreate = true">Add tenant</button>
    </div>

    <div v-if="showCreate" class="card create-form">
      <h3>New tenant</h3>
      <div class="form-row">
        <div class="field">
          <label>Name</label>
          <input v-model="newTenant.name" type="text" placeholder="Acme Corp" class="input" />
        </div>
        <div class="field">
          <label>Slug</label>
          <input v-model="newTenant.slug" type="text" placeholder="acme-corp" class="input" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Plan</label>
          <select v-model="newTenant.plan" class="input">
            <option value="Starter">Starter</option>
            <option value="Team">Team</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div class="field">
          <label>Status</label>
          <select v-model="newTenant.status" class="input">
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="showCreate = false">Cancel</button>
        <button type="button" class="btn btn-primary" @click="createTenant">Create tenant</button>
      </div>
    </div>

    <div class="card table-card">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in tenants" :key="t.id">
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
              <td class="actions-cell">
                <button type="button" class="btn-link" @click="viewAsTenant(t)">View as tenant</button>
                <span class="sep">·</span>
                <button type="button" class="btn-link" @click="toggleStatus(t)">
                  {{ t.status === 'active' ? 'Suspend' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tenant-list {
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

.create-form {
  padding: 1.25rem;
}

.create-form h3 {
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.field {
  flex: 1;
  min-width: 160px;
}

.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 0.95rem;
}

.select {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
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

.actions-cell {
  white-space: nowrap;
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

.sep {
  color: var(--border);
  margin: 0 0.35rem;
}
</style>
