<script setup>
</script>

<template>
  <div class="settings-view">
    <section class="card settings-card">
      <h2 class="card-title">Organization</h2>
      <div class="settings-form">
        <div class="field">
          <label>Organization name</label>
          <input type="text" value="Acme Corp" class="input" />
        </div>
        <div class="field">
          <label>Slug</label>
          <input type="text" value="acme-corp" class="input" readonly />
          <span class="field-hint">Used in URLs. Contact support to change.</span>
        </div>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </section>

    <section class="card settings-card">
      <h2 class="card-title">Team</h2>
      <p class="text-muted" style="margin-bottom: 1rem;">Manage who has access to this organization.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>you@acme.com</td>
              <td><span class="badge badge--muted">Owner</span></td>
              <td></td>
            </tr>
            <tr>
              <td>dev@acme.com</td>
              <td><span class="badge badge--muted">Admin</span></td>
              <td><button type="button" class="btn-link">Edit</button></td>
            </tr>
            <tr>
              <td>eng@acme.com</td>
              <td><span class="badge badge--muted">Member</span></td>
              <td><button type="button" class="btn-link">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn btn-ghost" style="margin-top: 1rem;">Invite member</button>
    </section>

    <section class="card settings-card danger-zone">
      <h2 class="card-title">Danger zone</h2>
      <p class="text-muted" style="margin-bottom: 1rem;">Permanently delete this organization and all data.</p>
      <button type="button" class="btn btn-ghost" style="border-color: var(--critical); color: var(--critical);">
        Delete organization
      </button>
    </section>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 720px;
}

.settings-card {
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.input {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  font-size: 0.95rem;
  max-width: 100%;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.input[readonly] {
  opacity: 0.7;
  background: var(--bg-elevated);
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.text-muted {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
}

.btn-link:hover {
  color: var(--accent-hover);
}

.danger-zone {
  border-color: var(--critical);
  background: linear-gradient(135deg, var(--critical-light) 0%, transparent 100%);
}

.danger-zone .card-title {
  color: var(--critical);
}

.danger-zone .btn:hover {
  background: var(--critical);
  color: var(--bg);
  border-color: var(--critical);
}
</style>
