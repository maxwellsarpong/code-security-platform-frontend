<script setup>
import TheNav from './components/TheNav.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import BillingSection from './components/BillingSection.vue'
import MetricsSection from './components/MetricsSection.vue'
import CtaSection from './components/CtaSection.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNav />
    <main>
      <HeroSection />
      <FeaturesSection />
      <MetricsSection />
      <BillingSection />
      <CtaSection />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
}
</style>
