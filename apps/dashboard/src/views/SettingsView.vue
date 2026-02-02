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
  gap: 1.5rem;
  max-width: 640px;
}

.settings-card {
  padding: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
}

.input {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 0.95rem;
  max-width: 320px;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
}

.input[readonly] {
  opacity: 0.8;
}

.field-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.text-muted {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.danger-zone .btn:hover {
  background: rgba(248, 113, 113, 0.1);
}
</style>
