<script setup>
import VulnerabilityFixSnippet from './VulnerabilityFixSnippet.vue'

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
      
      <div class="process-grid-wrapper">
        <div class="steps-container">
          <div v-for="step in steps" :key="step.number" class="step-card">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>

        <div class="snippet-showcase">
          <VulnerabilityFixSnippet />
          <p class="snippet-caption">Real-time remediation suggestions powered by security-tuned AI.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process {
  background: var(--bg-elevated);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, var(--bg-elevated) 100%);
  padding-bottom: 8rem;
}

.process-grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  position: relative;
}

.steps-container::before {
  content: '';
  position: absolute;
  top: 32px;
  left: 32px;
  right: 32px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 80%, transparent 100%);
  z-index: 0;
}

.snippet-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: fadeInUp 1s ease-out;
}

.snippet-caption {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-style: italic;
  max-width: 400px;
  text-align: center;
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
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
}

.step-card:hover .step-number {
  transform: translateY(-4px) scale(1.08);
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .steps-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .steps-container::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .steps-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .step-card {
    flex-direction: row;
    text-align: left;
    gap: 1.5rem;
    align-items: flex-start;
  }
  .step-number {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    margin-bottom: 0;
  }
}
</style>
