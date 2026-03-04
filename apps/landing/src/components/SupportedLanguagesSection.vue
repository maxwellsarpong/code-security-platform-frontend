<script setup>
const languages = [
  { name: 'JavaScript', color: '#F7DF1E', bg: 'rgba(247, 223, 30, 0.1)' },
  { name: 'TypeScript', color: '#3178C6', bg: 'rgba(49, 120, 198, 0.1)' },
  { name: 'Python', color: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)' },
  { name: 'Go', color: '#00ADD8', bg: 'rgba(0, 173, 216, 0.1)' },
  { name: 'Rust', color: '#DEA584', bg: 'rgba(222, 165, 132, 0.1)' },
  { name: 'Java', color: '#ED8B00', bg: 'rgba(237, 139, 0, 0.1)' },
  { name: 'Ruby', color: '#CC342D', bg: 'rgba(204, 52, 45, 0.1)' },
  { name: 'C++', color: '#00599C', bg: 'rgba(0, 89, 156, 0.1)' },
  { name: 'PHP', color: '#777BB4', bg: 'rgba(119, 123, 180, 0.1)' },
  { name: 'C#', color: '#239120', bg: 'rgba(35, 145, 32, 0.1)' },
  { name: 'Swift', color: '#F05138', bg: 'rgba(240, 81, 56, 0.1)' },
  { name: 'Kotlin', color: '#7F52FF', bg: 'rgba(127, 82, 255, 0.1)' },
  { name: 'Docker', color: '#2496ED', bg: 'rgba(36, 150, 237, 0.1)' },
  { name: 'Kubernetes', color: '#326CE5', bg: 'rgba(50, 108, 229, 0.1)' },
  { name: 'Terraform', color: '#844FBA', bg: 'rgba(132, 79, 186, 0.1)' },
]

// Duplicate the array for a seamless infinite scroll effect
const marqueeItems = [...languages, ...languages, ...languages, ...languages]
</script>

<template>
  <section id="supported-languages" class="section languages">
    <div class="container">
      <div class="header-content">
        <h2 class="section-title">Broad Ecosystem Support</h2>
        <p class="section-subtitle">
          Seamlessly secure your repositories across all major programming languages, frameworks, and infrastructure setups.
        </p>
      </div>

      <div class="marquee-wrapper">
        <div class="fade-overlay left"></div>
        <div class="fade-overlay right"></div>
        <div class="marquee">
          <div class="marquee-content">
            <div 
              v-for="(lang, index) in marqueeItems" 
              :key="index"
              class="lang-badge"
              :style="{ '--badge-color': lang.color, '--badge-bg': lang.bg }"
            >
              <div class="dot" :style="{ backgroundColor: lang.color }"></div>
              <span>{{ lang.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reverse direction marquee for visual interest -->
      <div class="marquee-wrapper reverse-wrapper">
        <div class="fade-overlay left"></div>
        <div class="fade-overlay right"></div>
        <div class="marquee reverse">
          <div class="marquee-content">
            <div 
              v-for="(lang, index) in [...marqueeItems].reverse()" 
              :key="index"
              class="lang-badge"
              :style="{ '--badge-color': lang.color, '--badge-bg': lang.bg }"
            >
              <div class="dot" :style="{ backgroundColor: lang.color }"></div>
              <span>{{ lang.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.languages {
  background: var(--bg);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.languages::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
}

.header-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem auto;
}

.marquee-wrapper {
  position: relative;
  width: 100vw;
  max-width: 100%;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  overflow: hidden;
}

.reverse-wrapper {
  margin-top: 1.5rem;
}

.fade-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15vw;
  z-index: 2;
  pointer-events: none;
}

.fade-overlay.left {
  left: 0;
  background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
}

.fade-overlay.right {
  right: 0;
  background: linear-gradient(to left, var(--bg) 0%, transparent 100%);
}

.marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1rem;
  animation: scrollX 40s linear infinite;
}

.marquee.reverse .marquee-content {
  animation: scrollXReverse 45s linear infinite;
}

.marquee:hover .marquee-content {
  animation-play-state: paused;
}

.lang-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  background: var(--badge-bg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: default;
  white-space: nowrap;
}

.lang-badge:hover {
  transform: translateY(-2px);
  border-color: var(--badge-color);
  box-shadow: 0 4px 20px var(--badge-bg);
}

.lang-badge span {
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: 0.5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px var(--badge-color);
}

@keyframes scrollX {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); } /* Shift by exactly half since we multiplied the array by 4 (so two halves are identical) */
}

@keyframes scrollXReverse {
  from { transform: translateX(-50%); } /* Shift by exactly half */
  to { transform: translateX(0); }
}

@media (max-width: 768px) {
  .fade-overlay {
    width: 25vw;
  }
  .lang-badge {
    padding: 0.6rem 1.2rem;
  }
  .lang-badge span {
    font-size: 0.95rem;
  }
}
</style>
