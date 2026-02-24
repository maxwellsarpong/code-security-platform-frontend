<script setup>
import { ref } from 'vue'
import TheNav from '../components/TheNav.vue'
import TheFooter from '../components/TheFooter.vue'

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  companySize: '',
  phone: '',
  message: '',
})

const submitted = ref(false)
const loading = ref(false)
const error = ref(null)

const submitForm = async () => {
  loading.value = true
  error.value = null

  try {
    const emailBody = `
Enterprise Subscription Inquiry

Name: ${formData.value.firstName} ${formData.value.lastName}
Email: ${formData.value.email}
Company: ${formData.value.company}
Company Size: ${formData.value.companySize}
Phone: ${formData.value.phone}

Message:
${formData.value.message}
    `.trim()

    // Using Formspree service for form submission
    const response = await fetch('https://formspree.io/f/mrearzyg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData.value,
      }),
    })

    if (response.ok) {
      submitted.value = true
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } else {
      error.value = 'Failed to submit form. Please try again.'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleInputChange = (e) => {
  const { name, value } = e.target
  formData.value[name] = value
}
</script>

<template>
  <div class="enterprise-page">
    <TheNav />
    <main class="enterprise-main">
      <div class="container">
        <div class="form-wrapper">
          <div class="form-header">
            <h1 class="form-title">Enterprise Subscription</h1>
            <p class="form-subtitle">
              Tell us about your organization and security needs. Our team will reach out within 24 hours.
            </p>
          </div>

          <div v-if="submitted" class="success-message">
            <div class="success-icon">✓</div>
            <h2>Thank you!</h2>
            <p>Your enterprise inquiry has been submitted successfully. We'll contact you within 24 hours.</p>
            <p class="redirect-text">Redirecting to home page...</p>
          </div>

          <form v-else @submit.prevent="submitForm" class="enterprise-form">
            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  id="firstName"
                  v-model="formData.firstName"
                  type="text"
                  name="firstName"
                  required
                  placeholder="John"
                  @input="handleInputChange"
                />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  id="lastName"
                  v-model="formData.lastName"
                  type="text"
                  name="lastName"
                  required
                  placeholder="Doe"
                  @input="handleInputChange"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Work Email *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  @input="handleInputChange"
                />
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  @input="handleInputChange"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="company">Company Name *</label>
              <input
                id="company"
                v-model="formData.company"
                type="text"
                name="company"
                required
                placeholder="Acme Corporation"
                @input="handleInputChange"
              />
            </div>

            <div class="form-group">
              <label for="companySize">Company Size *</label>
              <select
                id="companySize"
                v-model="formData.companySize"
                name="companySize"
                required
                @change="handleInputChange"
              >
                <option value="">Select company size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Tell us about your needs *</label>
              <textarea
                id="message"
                v-model="formData.message"
                name="message"
                required
                placeholder="Describe your organization's security requirements, team size, and any specific features you need..."
                rows="5"
                @input="handleInputChange"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Submitting...' : 'Submit Enterprise Inquiry' }}
              </button>
              <router-link to="/" class="btn btn-outline">Back to home</router-link>
            </div>
          </form>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.enterprise-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.enterprise-main {
  flex: 1;
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, transparent 0%, rgba(34, 211, 238, 0.03) 100%);
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.success-message {
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  color: var(--success);
  margin-bottom: 1rem;
}

.success-message h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.redirect-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  font-style: italic;
}

.enterprise-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.enterprise-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
}

.error-message {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: var(--critical);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
  display: block;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.85rem 1rem;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 200px;
  padding: 0.9rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), #67e8f9);
  color: var(--bg);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.35);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #67e8f9, #80f0ff);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(34, 211, 238, 0.45);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  color: var(--accent);
  border: 2px solid var(--accent);
  background: transparent;
}

.btn-outline:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: #67e8f9;
  color: #67e8f9;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.2);
}

@media (max-width: 768px) {
  .enterprise-main {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-wrapper {
    max-width: 100%;
  }

  .enterprise-form {
    padding: 1.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    flex: 1;
    min-width: auto;
  }
}
</style>
