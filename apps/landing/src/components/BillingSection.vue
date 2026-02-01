<script setup>
const plans = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'For small teams and side projects.',
    features: [
      'Up to 5 developers',
      '3 private repos',
      'Basic SAST & secrets',
      'Community support',
    ],
    cta: 'Get started free',
    ctaHref: '#cta',
    highlighted: false,
  },
  {
    name: 'Team',
    price: 29,
    period: 'per developer / month',
    description: 'For growing engineering teams.',
    features: [
      'Unlimited developers',
      'Unlimited private repos',
      'Full SAST, secrets, SCA',
      'Compliance & policy engine',
      'Priority support',
    ],
    cta: 'Start free trial',
    ctaHref: '#cta',
    highlighted: true,
  },
  {
    name: 'Enterprise',
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
    ctaHref: '#cta',
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
          <a :href="plan.ctaHref" class="plan-cta" :class="{ primary: plan.highlighted }">
            {{ plan.cta }}
          </a>
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
  max-width: 960px;
  margin: 0 auto;
}

.plan-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.plan-card:hover {
  border-color: rgba(34, 211, 238, 0.25);
}

.plan-card.highlighted {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 8px 24px rgba(0, 0, 0, 0.3);
}

.plan-header {
  margin-bottom: 1.5rem;
}

.plan-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.25rem;
  color: var(--text-muted);
}

.amount {
  font-size: 2.25rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text);
}

.period {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-left: 0.25rem;
}

.plan-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.plan-features {
  list-style: none;
  flex: 1;
  margin-bottom: 1.5rem;
}

.plan-features li {
  padding: 0.4rem 0;
  padding-left: 1.25rem;
  position: relative;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: 600;
}

.plan-cta {
  display: block;
  text-align: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  background: transparent;
  border: 2px solid var(--border);
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
}

.plan-cta:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-decoration: none;
}

.plan-cta.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.plan-cta.primary:hover {
  background: #67e8f9;
  border-color: #67e8f9;
  color: var(--bg);
  text-decoration: none;
}

.billing-note {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 2rem;
}
</style>
