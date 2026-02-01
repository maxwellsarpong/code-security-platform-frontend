<script setup>
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="/" class="logo">
          <span class="logo-icon">◈</span>
          <span>SecureCode</span>
        </a>
        <p class="tagline">Code security platform for modern teams.</p>
      </div>
      <div class="footer-links">
        <div class="col">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#billing">Pricing</a>
          <a href="/dashboard">Dashboard</a>
        </div>
        <div class="col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
        <div class="col">
          <h4>Legal</h4>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>© {{ new Date().getFullYear() }} SecureCode. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 3rem 1.5rem 2rem;
  justify-content: space-between;
}

.footer-brand .logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
}

.footer-brand .logo:hover {
  color: var(--accent);
  text-decoration: none;
}

.logo-icon {
  color: var(--accent);
}

.tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.col h4 {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.col {
  display: flex;
  flex-direction: column;
}

.col a {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
}

.col a:hover {
  color: var(--accent);
}

.footer-bottom {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.footer-bottom span {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
