<script setup>
import { ref, onMounted } from 'vue'
import DashboardAuthService from '../services/authService'

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')

const profile = ref({
  github_token: '',
  gitlab_token: '',
  bitbucket_token: '',
  jira_url: '',
  jira_email: '',
  jira_api_token: '',
  jira_project_key: '',
  slack_webhook_url: ''
})

onMounted(async () => {
  try {
    const userData = await DashboardAuthService.fetchUserProfile()
    // Populate form with existing data, handling nulls gracefully
    Object.keys(profile.value).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        profile.value[key] = userData[key]
      }
    })
  } catch (err) {
    error.value = 'Failed to load profile data'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const saveProfile = async () => {
  saving.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    // Only send fields that have values to avoid overwriting with empties unnecessarily
    // Or send all if that's the desired API behavior (our backend allows partial updates)
    const payload = {}
    Object.keys(profile.value).forEach(key => {
      // Send empty strings to allow clearing values, but don't send if we haven't loaded yet
      payload[key] = profile.value[key]
    })
    
    await DashboardAuthService.updateUserProfile(payload)
    successMessage.value = 'Profile updated successfully'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Failed to update profile'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="settings-view">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading profile settings...</p>
    </div>
    
    <div v-else>
      <div v-if="error" class="alert alert-error mb-4">
        {{ error }}
      </div>
      <div v-if="successMessage" class="alert alert-success mb-4">
        {{ successMessage }}
      </div>

      <form @submit.prevent="saveProfile">
        <section class="card settings-card mb-4">
          <h2 class="card-title">Version Control Integrations</h2>
          <p class="text-muted mb-4">Configure tokens to allow the platform to scan your repositories and create pull requests for vulnerabilities.</p>
          
          <div class="settings-form">
            <div class="field">
              <label for="github_token">GitHub Personal Access Token</label>
              <input type="password" id="github_token" v-model="profile.github_token" class="input" placeholder="ghp_..." />
              <span class="field-hint">Required for scanning GitHub repositories and opening automated PRs. Needs 'repo' scope.</span>
            </div>
            
            <div class="field">
              <label for="gitlab_token">GitLab Access Token</label>
              <input type="password" id="gitlab_token" v-model="profile.gitlab_token" class="input" placeholder="glpat-..." />
            </div>

            <div class="field">
              <label for="bitbucket_token">Bitbucket App Password</label>
              <input type="password" id="bitbucket_token" v-model="profile.bitbucket_token" class="input" placeholder="App password" />
            </div>
          </div>
        </section>

        <section class="card settings-card mb-4">
          <h2 class="card-title">Jira Integration</h2>
          <p class="text-muted mb-4">Configure Jira to automatically create tickets for new vulnerabilities.</p>
          
          <div class="settings-form">
            <div class="field">
              <label for="jira_url">Jira URL</label>
              <input type="url" id="jira_url" v-model="profile.jira_url" class="input" placeholder="https://your-domain.atlassian.net" />
            </div>
            
            <div class="field">
              <label for="jira_email">Jira Email</label>
              <input type="email" id="jira_email" v-model="profile.jira_email" class="input" placeholder="you@example.com" />
            </div>

            <div class="field">
              <label for="jira_api_token">Jira API Token</label>
              <input type="password" id="jira_api_token" v-model="profile.jira_api_token" class="input" placeholder="Create this in Atlassian account settings" />
            </div>
            
            <div class="field">
              <label for="jira_project_key">Default Project Key</label>
              <input type="text" id="jira_project_key" v-model="profile.jira_project_key" class="input" placeholder="e.g. SEC" />
              <span class="field-hint">The project where new vulnerability issues will be created.</span>
            </div>
          </div>
        </section>

        <section class="card settings-card mb-4">
          <h2 class="card-title">Notifications</h2>
          
          <div class="settings-form">
            <div class="field">
              <label for="slack_webhook_url">Slack Webhook URL</label>
              <input type="url" id="slack_webhook_url" v-model="profile.slack_webhook_url" class="input" placeholder="https://hooks.slack.com/services/..." />
              <span class="field-hint">Receive alerts about completed scans and critical findings in your Slack workspace.</span>
            </div>
          </div>
        </section>

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving Changes...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mb-4 {
  margin-bottom: 1.5rem;
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
  margin: 0 0 0.5rem 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.input:disabled {
  opacity: 0.7;
  background: var(--bg-elevated);
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.text-muted {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.alert {
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--critical);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-success {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a; /* A nice green */
  border: 1px solid rgba(34, 197, 94, 0.2);
}
</style>
