<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const planSlug = computed(() => route.query.plan || 'team')

const plans = {
  starter: { name: 'Starter', price: 0, period: 'forever' },
  team: { name: 'Team', price: 29, period: 'per developer / month' },
  enterprise: { name: 'Enterprise', price: null, period: 'Custom' },
}

const selectedPlan = computed(() => plans[planSlug.value] || plans.team)

const form = ref({
  email: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  name: '',
})

const submitting = ref(false)

function submitCheckout() {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    router.push('/login')
  }, 1000)
}
</script>

<template>
  <div class="checkout-page">
    <header class="checkout-header">
      <div class="container header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">◈</span>
          <span>SecureCode</span>
        </router-link>
        <router-link to="/" class="back-link">← Back to home</router-link>
      </div>
    </header>

    <main class="checkout-main">
      <div class="container checkout-inner">
        <h1 class="checkout-title">Checkout</h1>
        <p class="checkout-subtitle">Complete your subscription to get started.</p>

        <div class="checkout-grid">
          <section class="card checkout-card plan-summary">
            <h2>Order summary</h2>
            <div class="plan-row">
              <span class="plan-name">{{ selectedPlan.name }}</span>
              <span v-if="selectedPlan.price !== null" class="plan-price">
                ${{ selectedPlan.price }} <span class="period">{{ selectedPlan.period }}</span>
              </span>
              <span v-else class="plan-price">Contact sales</span>
            </div>
            <p class="plan-note">14-day free trial. No charge until trial ends.</p>
            <router-link to="/#billing" class="link">Change plan</router-link>
          </section>

          <section class="card checkout-card payment-form">
            <h2>Payment details</h2>
            <form @submit.prevent="submitCheckout" class="form">
              <div class="field">
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="you@company.com" required class="input" />
              </div>
              <div class="field">
                <label>Card number</label>
                <input v-model="form.cardNumber" type="text" placeholder="4242 4242 4242 4242" maxlength="19" class="input" />
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Expiry</label>
                  <input v-model="form.expiry" type="text" placeholder="MM/YY" maxlength="5" class="input" />
                </div>
                <div class="field">
                  <label>CVC</label>
                  <input v-model="form.cvc" type="text" placeholder="123" maxlength="4" class="input" />
                </div>
              </div>
              <div class="field">
                <label>Name on card</label>
                <input v-model="form.name" type="text" placeholder="Full name" class="input" />
              </div>
              <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
                {{ submitting ? 'Processing…' : 'Subscribe' }}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.checkout-header {
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

.checkout-main {
  padding: 3rem 0;
}

.checkout-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.checkout-subtitle {
  color: var(--text-muted);
  margin: 0 0 2rem 0;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  max-width: 800px;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.checkout-card {
  padding: 1.5rem;
}

.checkout-card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.plan-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.plan-name {
  font-weight: 600;
}

.plan-price {
  font-family: var(--font-mono);
  color: var(--accent);
}

.period {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: normal;
}

.plan-note {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
}

.link {
  font-size: 0.9rem;
}

.form {
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

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
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
  margin-top: 0.5rem;
}
</style>
