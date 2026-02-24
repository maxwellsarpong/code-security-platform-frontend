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
          <router-link to="/#features">Features</router-link>
          <router-link to="/checkout">Pricing</router-link>
          <router-link to="/login">Dashboard</router-link>
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
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  padding: 4rem 1.5rem 2.5rem;
  justify-content: space-between;
}

.footer-brand .logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text);
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-brand .logo:hover {
  color: var(--accent);
  text-decoration: none;
}

.logo-icon {
  color: var(--accent);
  font-size: 1.25rem;
}

.tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.75rem;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.col h4 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.col a {
  color: var(--text-muted);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.col a:hover {
  color: var(--accent);
  transform: translateX(4px);
}

.footer-bottom {
  padding: 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.2);
}

.footer-bottom span {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
