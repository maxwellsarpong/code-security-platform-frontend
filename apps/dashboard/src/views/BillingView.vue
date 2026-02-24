<script setup>
const plan = {
  name: 'Team',
  price: 29,
  period: 'per developer / month',
  developers: 8,
  nextBilling: 'Mar 1, 2025',
}

const usage = [
  { label: 'Scans this month', value: '1,247', limit: 'Unlimited' },
  { label: 'Repositories', value: '12', limit: 'Unlimited' },
  { label: 'Developers', value: '8', limit: '10' },
]
</script>

<template>
  <div class="billing-view">
    <div class="billing-grid">
      <section class="card billing-card">
        <h2 class="card-title">Current plan</h2>
        <div class="plan-info">
          <div class="plan-name">{{ plan.name }}</div>
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="period">{{ plan.period }}</span>
          </div>
          <p class="plan-meta">{{ plan.developers }} developers · Next billing {{ plan.nextBilling }}</p>
          <button type="button" class="btn btn-ghost" style="margin-top: 1rem;">Change plan</button>
        </div>
      </section>

      <section class="card billing-card">
        <h2 class="card-title">Usage</h2>
        <div class="usage-list">
          <div v-for="u in usage" :key="u.label" class="usage-row">
            <span class="usage-label">{{ u.label }}</span>
            <span class="usage-value">{{ u.value }} <span class="usage-limit">/ {{ u.limit }}</span></span>
          </div>
        </div>
      </section>
    </div>

    <section class="card billing-card payment-section">
      <h2 class="card-title">Payment method</h2>
      <div class="payment-info">
        <span class="payment-detail">•••• •••• •••• 4242</span>
        <span class="text-muted">Expires 12/26</span>
        <button type="button" class="btn btn-ghost" style="margin-left: auto;">Update</button>
      </div>
    </section>

    <section class="card billing-card">
      <h2 class="card-title">Invoices</h2>
      <p class="text-muted" style="margin-bottom: 1rem;">Download past invoices.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Feb 1, 2025</td>
              <td>$232.00</td>
              <td><span class="badge badge--success">Paid</span></td>
              <td><button type="button" class="btn-link">Download</button></td>
            </tr>
            <tr>
              <td>Jan 1, 2025</td>
              <td>$232.00</td>
              <td><span class="badge badge--success">Paid</span></td>
              <td><button type="button" class="btn-link">Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.billing-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.billing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.billing-card {
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.billing-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.currency {
  color: var(--text-muted);
  font-size: 1.25rem;
}

.amount {
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent);
}

.period {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
}

.plan-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.usage-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.usage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.usage-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.usage-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.usage-value {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--accent);
}

.usage-limit {
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 0.25rem;
}

.payment-section .payment-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.payment-detail {
  font-family: var(--font-mono);
  color: var(--text);
  font-weight: 600;
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
</style>
