<script setup>
const steps = [
  {
    number: 1,
    title: 'Scan Repository',
    description: 'Automatically scan your codebase to identify security vulnerabilities and compliance issues.',
  },
  {
    number: 2,
    title: 'Resolve for Vulnerabilities',
    description: 'Analyze findings and determine the best approach to fix and remediate identified security issues.',
  },
  {
    number: 3,
    title: 'Create Pull Request',
    description: 'Generate and submit pull requests with fixes for review and integration into your codebase.',
  },
  {
    number: 4,
    title: 'Notify Teams on Slack',
    description: 'Send real-time notifications to your team channels to keep everyone informed of progress.',
  },
  {
    number: 5,
    title: 'Create Jira Ticket',
    description: 'Track remediation efforts with automatic Jira ticket creation for audit and compliance records.',
  },
]
</script>

<template>
  <section id="process" class="section process">
    <div class="container">
      <h2 class="section-title">Vulnerability Fixing Process</h2>
      <p class="section-subtitle">
        An automated workflow to detect, resolve, and track security vulnerabilities across your organization.
      </p>
      <div class="steps-container">
        <div v-for="step in steps" :key="step.number" class="step-card">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
          <div v-if="step.number < steps.length" class="step-connector" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process {
  background: var(--bg-elevated);
}

.process {
  background: var(--bg-elevated);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, var(--bg-elevated) 100%);
}

.steps-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.steps-container::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 80%, transparent 100%);
  z-index: 0;
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
}

.step-card:last-child .steps-container::before {
  right: 0;
}

.step-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #67e8f9);
  color: var(--bg);
  font-weight: 800;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 0 4px var(--bg-elevated), 0 0 0 6px rgba(34, 211, 238, 0.5), 0 8px 24px rgba(34, 211, 238, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.step-number::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.step-card:hover .step-number {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 0 0 4px var(--bg-elevated), 0 0 0 6px rgba(34, 211, 238, 0.8), 0 12px 32px rgba(34, 211, 238, 0.4);
}

.step-card:hover .step-number::before {
  opacity: 1;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
}

.step-description {
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .steps-container {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1.5rem;
  }

  .step-number {
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
  }

  .step-title {
    font-size: 0.95rem;
  }

  .step-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .steps-container {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    padding: 1.5rem 0;
  }

  .steps-container::before {
    display: none;
  }

  .step-number {
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 0 0 3px var(--bg-elevated), 0 0 0 5px rgba(34, 211, 238, 0.6), 0 4px 12px rgba(34, 211, 238, 0.25);
  }

  .step-title {
    font-size: 0.9rem;
  }

  .step-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .steps-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .step-card {
    text-align: left;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }

  .step-number {
    width: 44px;
    height: 44px;
    font-size: 1rem;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .step-content {
    padding-top: 0.25rem;
  }

  .step-title {
    font-size: 0.95rem;
  }

  .step-description {
    font-size: 0.8rem;
  }
}
</style>
