<script setup>
import { ref } from 'vue'
import AuthService from '../services/authService'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function submitRecovery() {
  error.value = ''
  loading.value = true
  
  try {
    await AuthService.requestPasswordRecovery(email.value)
    success.value = true
  } catch (err) {
    error.value = err.message || 'Failed to send recovery email. Please try again.'
  } finally {
    loading.value = false
  }
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
        <router-link to="/login" class="back-link">← Back to login</router-link>
      </div>
    </header>

    <main class="login-main">
      <div class="login-card-wrap">
        <div class="card login-card">
          <h1 class="login-title">Reset password</h1>
          <p class="login-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div v-if="success" class="success-message">
            <span class="success-icon">✓</span>
            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
          </div>

          <form v-else @submit.prevent="submitRecovery" class="auth-form">
            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <div class="field">
              <label>Email</label>
              <input v-model="email" type="email" placeholder="you@company.com" required class="input" :disabled="loading" />
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Sending...' : 'Send reset link' }}
            </button>
          </form>

          <p class="auth-switch">
            Remember your password?
            <router-link to="/login" class="btn-link">Sign in</router-link>
          </p>
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
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #fca5a5;
  font-size: 0.9rem;
}

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius);
  color: #34d399;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-icon, .success-icon {
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

.btn-block {
  width: 100%;
}

.auth-switch {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 1.5rem 0 0 0;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  text-decoration: none;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
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
</style>
