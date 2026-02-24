<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isSuperAdmin, isTenantAdmin, currentUser } = useAuth()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="unauthorized-view">
    <div class="unauthorized-card">
      <div class="icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 7V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="12" cy="16.5" r="1" fill="currentColor"/>
          <path d="M4 4L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      
      <h1 class="title">Access Denied</h1>
      <p class="description">
        You don't have permission to access this page.
      </p>
      
      <div class="user-info">
        <p><strong>Current Role:</strong> {{ currentUser?.role || 'Unknown' }}</p>
        <p><strong>User:</strong> {{ currentUser?.email || 'Not logged in' }}</p>
      </div>
      
      <div class="actions">
        <button type="button" class="btn btn-ghost" @click="goBack">
          ← Go Back
        </button>
        <button type="button" class="btn btn-primary" @click="goHome">
          Go to Dashboard
        </button>
      </div>
      
      <div class="help-text">
        <p>If you believe this is an error, please contact your administrator.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unauthorized-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg);
  padding: 2rem;
}

.unauthorized-card {
  max-width: 500px;
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon {
  color: var(--critical);
  opacity: 0.8;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.description {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.user-info {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
}

.user-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.user-info strong {
  color: var(--text);
}

.actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}

.btn-primary:hover {
  background: #67e8f9;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.help-text {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  width: 100%;
}

.help-text p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
