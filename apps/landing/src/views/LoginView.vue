<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboard } from '../composables/useDashboard'
import { useAuthLanding } from '../composables/useAuthLanding'
import authService from '../services/authService'

const router = useRouter()
const { goToDashboard } = useDashboard()
const { login, register, loading, error, clearError } = useAuthLanding()

const mode = ref('signin') // 'signin' | 'signup'

const form = ref({
  email: '',
  password: '',
  tenant_name: '',
})

onMounted(() => {
  // If user is already authenticated, redirect to dashboard
  if (authService.isAuthenticated()) {
    goToDashboard()
  }
})

async function submitAuth() {
  clearError()

  try {
    if (mode.value === 'signin') {
      await login(form.value.email, form.value.password)
    } else {
      await register(form.value.email, form.value.password, form.value.tenant_name)
    }
    
    // Redirect to dashboard on success
    goToDashboard()
  } catch (err) {
    // Error is already set in the composable
    console.error('Auth error:', err)
  }
}

function toggleMode() {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  clearError()
  form.value.tenant_name = ''
  form.value.email = ''
  form.value.password = ''
}
</script>

<template>
  <div class="login-page">
    <header class="login-header">
      <div class="container header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">◈</span>
          <span>SecureCode</span>
        </router-link>
        <router-link to="/" class="back-link">← Back to home</router-link>
      </div>
    </header>

    <main class="login-main">
      <div class="login-card-wrap">
        <div class="card login-card">
          <h1 class="login-title">{{ mode === 'signin' ? 'Sign in' : 'Create account' }}</h1>
          <p class="login-subtitle">
            {{ mode === 'signin' ? 'Sign in to your SecureCode dashboard.' : 'Get started with a free trial.' }}
          </p>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <form @submit.prevent="submitAuth" class="auth-form">
            <div v-if="mode === 'signup'" class="field">
              <label>Tenant Name</label>
              <input v-model="form.tenant_name" type="text" placeholder="Acme Corp" class="input" required :disabled="loading" />
            </div>
            <div class="field">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="you@company.com" required class="input" :disabled="loading" />
            </div>
            <div class="field">
              <label>Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••" required class="input" :disabled="loading" />
            </div>
            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Authenticating…' : (mode === 'signin' ? 'Sign in' : 'Create account') }}
            </button>
          </form>

          <p class="auth-switch">
            {{ mode === 'signin' ? "Don't have an account?" : 'Already have an account?' }}
            <button type="button" class="btn-link" @click="toggleMode" :disabled="loading">
              {{ mode === 'signin' ? 'Sign up' : 'Sign in' }}
            </button>
          </p>

          <div class="divider">
            <span>or</span>
          </div>

          <button type="button" class="btn btn-ghost btn-block" disabled>
            Sign in with Google (coming soon)
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.login-header {
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
  text-decoration: none;
}

.logo:hover {
  color: var(--accent);
  text-decoration: none;
}

.logo-icon {
  color: var(--accent);
}

.back-link {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--accent);
  text-decoration: none;
}

.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 65px);
  padding: 2rem;
}

.login-card-wrap {
  width: 100%;
  max-width: 400px;
}

.login-card {
  padding: 2rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.login-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 0.95rem;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #fca5a5;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.1rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}

.btn-primary:hover:not(:disabled) {
  background: #67e8f9;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn-ghost:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-block {
  width: 100%;
}

.auth-switch {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 1rem 0 0 0;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider span {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
