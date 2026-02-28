<script setup>
const plans = [
  {
    name: 'Starter',
    slug: 'starter',
    price: 0,
    period: '2 Scans/month',
    description: 'For small teams and side projects.',
    features: [
      '2 Scans',
      'Basic SAST & secrets',
      'Community support',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Team',
    slug: 'team',
    price: 15,
    period: '500 Scans',
    description: 'For growing engineering teams.',
    features: [
      '500 Scans',
      'Full SAST, secrets, SCA',
      'Compliance & policy engine',
      'Priority support',
    ],
    cta: 'Upgrade to Team',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    price: null,
    period: 'Custom',
    description: 'For large orgs with advanced needs.',
    features: [
      'Everything in Team',
      'SSO & SAML',
      'Dedicated support',
      'Custom SLAs',
      'On-prem options',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]
</script>

<template>
  <section id="billing" class="section billing">
    <div class="container">
      <h2 class="section-title">Simple, transparent billing</h2>
      <p class="section-subtitle">
        Start free. Scale as you grow. No hidden fees.
      </p>
      <div class="plans-grid">
        <article
          v-for="plan in plans"
          :key="plan.name"
          class="plan-card"
          :class="{ highlighted: plan.highlighted }"
        >
          <div class="plan-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <template v-if="plan.price !== null">
                <span class="currency">$</span>
                <span class="amount">{{ plan.price }}</span>
              </template>
              <template v-else>
                <span class="amount">Custom</span>
              </template>
              <span class="period">{{ plan.period }}</span>
            </div>
            <p class="plan-desc">{{ plan.description }}</p>
          </div>
          <ul class="plan-features">
            <li v-for="f in plan.features" :key="f">{{ f }}</li>
          </ul>
          <router-link :to="plan.slug === 'starter' ? '/login' : plan.slug === 'enterprise' ? '/enterprise' : { path: '/checkout', query: { plan: plan.slug } }" class="plan-cta" :class="{ primary: plan.highlighted }">
            {{ plan.cta }}
          </router-link>
        </article>
      </div>
      <p class="billing-note">
        All plans include 14-day free trial. No credit card required for Starter.
      </p>
    </div>
  </section>
</template>

<style scoped>
.billing {
  background: var(--bg);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: stretch;
  max-width: 1000px;
  margin: 0 auto;
}

.plan-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
}

.plan-card:hover {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 20px 48px rgba(34, 211, 238, 0.15);
  transform: translateY(-8px);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, var(--bg-card) 100%);
}

.plan-card.highlighted {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 20px 48px rgba(34, 211, 238, 0.3);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, var(--bg-card) 100%);
  position: relative;
}

.plan-card.highlighted::after {
  content: 'POPULAR';
  position: absolute;
  top: 1.5rem;
  right: -2.5rem;
  background: var(--accent);
  color: var(--bg);
  padding: 0.25rem 3rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  transform: rotate(45deg);
  box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
}

.plan-card.highlighted:hover {
  box-shadow: 0 0 0 1px var(--accent), 0 28px 64px rgba(34, 211, 238, 0.35);
  transform: translateY(-10px);
}

.plan-header {
  margin-bottom: 2rem;
}

.plan-name {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text);
}

.plan-price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.currency {
  font-size: 1.25rem;
  color: var(--text-muted);
  font-weight: 600;
}

.amount {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--accent);
}

.period {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-left: 0.5rem;
  font-weight: 500;
}

.plan-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.plan-features {
  list-style: none;
  flex: 1;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.plan-features li {
  padding: 0.5rem 0;
  padding-left: 1.75rem;
  position: relative;
  font-size: 0.95rem;
  color: var(--text-muted);
  transition: all 0.2s ease;
  font-weight: 500;
}

.plan-card:hover .plan-features li {
  color: var(--text);
  padding-left: 2rem;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: 800;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.plan-card:hover .plan-features li::before {
  left: 0.25rem;
  color: var(--accent);
}

.plan-cta {
  display: block;
  text-align: center;
  padding: 0.85rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 700;
  background: transparent;
  border: 2px solid var(--border);
  color: var(--text);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
  font-size: 1rem;
}

.plan-cta:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.25), inset 0 0 0 1px rgba(34, 211, 238, 0.1);
  transform: translateY(-2px);
}

.plan-cta.primary {
  background: linear-gradient(135deg, var(--accent), #67e8f9);
  border-color: var(--accent);
  color: var(--bg);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.35);
  font-weight: 800;
}

.plan-cta.primary:hover {
  background: linear-gradient(135deg, #67e8f9, #80f0ff);
  border-color: #67e8f9;
  color: var(--bg);
  box-shadow: 0 12px 32px rgba(34, 211, 238, 0.45);
  transform: translateY(-3px);
}

.billing-note {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-top: 2.5rem;
  font-weight: 500;
}
</style>
