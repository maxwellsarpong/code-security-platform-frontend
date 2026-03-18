<script setup>
import { ref } from 'vue'

const codeSnippet = `name: Security Scan
on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install scp-cli
        run: pip install scp-cli

      - name: Authenticate with scp-cli tool
        run: scp-cli auth --api-key \${{ secrets.SCP_API_KEY }}
        
      - name: Run Security check
        run: scp-cli check <scan_id> --severity HIGH --fail`

const features = [
  {
    title: 'Easy Integration',
    description: 'Add scp-cli to any CI/CD pipeline with a single command. Support for GitHub Actions, GitLab CI, Jenkins, and more.'
  },
  {
    title: 'Automated Blocking',
    description: 'Configure thresholds to automatically block pull requests that introduce high-severity vulnerabilities.'
  },
  {
    title: 'Real-time Results',
    description: 'Get immediate feedback in your terminal or CI logs, with direct links to remediation guides.'
  }
]
</script>

<template>
  <section class="section cli-showcase">
    <div class="container overflow-hidden">
      <div class="grid">
        <div class="content">
          <h2 class="section-title text-left">Built for Developers</h2>
          <p class="section-subtitle text-left">
            Integrate security into your existing workflow without friction. Our powerful CLI tool makes it easy to automate security checks at every stage.
          </p>
          
          <ul class="feature-list">
            <li v-for="f in features" :key="f.title" class="feature-item">
              <div class="feature-icon-small">✓</div>
              <div class="feature-text">
                <h4 class="feature-title-small">{{ f.title }}</h4>
                <p class="feature-desc-small">{{ f.description }}</p>
              </div>
            </li>
          </ul>

          <div class="cta-wrapper">
            <a href="https://pypi.org/project/scp-cli/" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              View on PyPI
            </a>
          </div>
        </div>

        <div class="terminal-wrapper">
          <div class="terminal">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="terminal-title">.github/workflows/security.yml</div>
            </div>
            <div class="terminal-body">
              <pre><code>{{ codeSnippet }}</code></pre>
            </div>
          </div>
          <div class="terminal-glow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cli-showcase {
  background: var(--bg);
  position: relative;
  padding: 8rem 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 5rem;
  align-items: center;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  gap: 1.25rem;
}

.feature-icon-small {
  width: 28px;
  height: 28px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}

.feature-title-small {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--text);
}

.feature-desc-small {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.terminal-wrapper {
  position: relative;
  perspective: 1000px;
}

.terminal {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: rotateY(-5deg) rotateX(2deg);
  transition: transform 0.5s ease;
}

.terminal:hover {
  transform: rotateY(0deg) rotateX(0deg);
}

.terminal-header {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-left: 2rem;
}

.terminal-body {
  padding: 1.5rem;
  overflow-x: auto;
}

pre {
  margin: 0;
  color: #e2e8f0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
}

code {
  color: var(--accent);
}

.terminal-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-32%, -45%);
  width: 110%;
  height: 110%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

.cta-wrapper {
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  
  .terminal {
    transform: none;
  }
}
</style>
